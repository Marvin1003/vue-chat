const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const colors = require('../assets/google/colors.json')

const PORT = process.env.PORT || 3000

app.set('port', PORT)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
server.listen(PORT, '0.0.0.0')
console.log('Server listening on localhost:' + PORT)

// SOCKET IO
let userList = {}
let count = -1

io.on('connection', socket => {
  socket.on('switch room', ({ prevRoom, nextRoom, name }) => {
    const user = removeUser(socket.id)

    if (!userList[nextRoom]) userList[nextRoom] = []
    userList[nextRoom].push(user)

    io.in(prevRoom).emit('roomChange', {
      user: name,
      userList: userList[prevRoom],
      type: 'LEFT THIS ROOM'
    })

    socket.leave(prevRoom)
    socket.join(nextRoom)

    io.in(nextRoom).emit('roomChange', {
      user: name,
      userList: userList[nextRoom],
      type: 'JOINED THIS ROOM'
    })
  })
  // Validate user name
  socket.on('validate', name => {
    const keys = Object.keys(userList)
    let exists = null

    for (const key of keys) {
      if (Array.isArray(userList[key])) {
        exists = userList[key].some(user => user.name === name)
        if (exists) break
      }
    }

    exists ? io.emit('validate', false) : io.emit('validate', true)
  })

  // User joined
  socket.on('joined', ({ name, room }) => {
    if (name && room) {
      socket.join(room)

      count++
      const color = getColor()

      if (!userList[room]) userList[room] = []
      userList[room].push({ name, id: socket.id, color })

      io.emit('roomChange', {
        name,
        userList: userList[room],
        type: 'JOINED'
      })
    }
  })

  // User is typing
  socket.on('isTyping', user => io.emit('isTyping', user))

  // Messages
  socket.on('message', msg => io.to(msg.room).emit('message', msg))

  socket.on('disconnect', () => {
    const removedUser = removeUser(socket.id)

    if (removedUser.name) {
      io.emit('roomChange', {
        user: removedUser.name,
        userList,
        type: 'DISCONNECTED'
      })
    }
  })
})

function removeUser(id) {
  const keys = Object.keys(userList)
  let removedUser = {}

  // Remove disconnected user from userlist
  for (const key of keys) {
    if (Array.isArray(userList[key])) {
      userList[key] = userList[key].filter(user => {
        if (user.id === id) {
          removedUser = user
          return false
        }
        return true
      })
    }
  }
  return removedUser
}

function getColor() {
  const color = Object.keys(colors)
  if (!colors[color[count]]) count = -1
  return colors[color[count]][500]
}
