<template>
  <div :class="className">
    <form @submit="sendMessage">
      <input type="text" rows="1" class="chat-message" placeholder="Type a message..." v-model="message" @input="isTyping" />
      <button type="submit">send</button>
    </form>
  </div>
</template>

<script>
var socket = null

export default {
  props: {
    className: {
      type: String,
      default: 'chat-messsage-container'
    },
    name: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)
  },
  data() {
    return {
      message: null,
      timeout: null,
      isTypingDuration: 750,
      isTypingEmit: true
    }
  },
  methods: {
    isTyping() {
      clearTimeout(this.timeout)

      if (this.isTypingEmit) {
        this.isTypingEmit = false
        socket.emit('isTyping', { name: this.name, isTyping: true })
      }

      this.timeout = setTimeout(() => {
        this.isTypingEmit = true
        socket.emit('isTyping', { name: this.name, isTyping: false })
      }, this.isTypingDuration)
    },
    sendMessage(e) {
      e && e.preventDefault()
      if (this.message && this.message.trim()) {
        const date = new Date()
        const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        const hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        const time = `${hours}:${minutes}`

        socket.emit('message', {
          name: this.name,
          msg: this.message,
          room: this.room,
          time
        })
        this.message = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message-container {
  padding: 20px 0;
  margin: 0 50px;
  form {
    display: flex;
    overflow: hidden;
    border-radius: $border-radius--primary;
    box-shadow: $box-shadow--light;
    .chat-message {
      flex-grow: 1;
      padding: 10px 20px;
      font-size: 14px;
    }
    button,
    input {
      background-color: $color_white;
    }
    button {
      padding: 0 20px;
      color: #2196f3;
      font-size: 16px;
      font-family: inherit;
      transition: color 0.25s ease-out;
      cursor: pointer;
      &:hover {
        color: $color_blue--hover;
      }
    }
  }
  @media screen and(max-width: 768px) {
    margin: 0 30px;
  }
  @media screen and(max-width: 400px) {
    margin: 0 15px;
  }
}
</style>