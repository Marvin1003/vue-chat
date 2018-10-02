const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

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
let userList = []
io.on('connection', socket => {
  socket.on('validate', name => {
    if (userList.includes(name)) io.emit('validate', false)
    else io.emit('validate', true)
  })
  socket.on('joined', user => {
    user && userList.push({ name: user, id: socket.id })
    io.emit('joined', {
      user,
      userList,
      type: 'joined'
    })
  })
  socket.on('message', msg => io.emit('message', msg))

  socket.on('disconnect', () => {
    let removedUser = null
    // Remove disconnected user from userlist
    userList = userList.filter(user => {
      if (user.id === socket.id) {
        removedUser = user.name
        return false
      }
      return true
    })

    io.emit('joined', { user: removedUser, userList, type: 'disconnected' })
  })
})
