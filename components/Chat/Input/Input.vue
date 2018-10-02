<template>
  <div :class="className">
    <form @submit="sendMessage">
      <input type="text" rows="1" class="chat-message" placeholder="Your message" v-model="message" />
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
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)
  },
  data() {
    return {
      message: null
    }
  },
  methods: {
    sendMessage(e) {
      e && e.preventDefault()
      if (this.message) {
        const date = new Date()
        const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        const time = `${date.getHours()}:${minutes}`

        socket.emit('message', { name: this.name, msg: this.message, time })
        this.message = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message-container {
  padding: 20px 0;
  margin: 0 75px;
   @media screen and(max-width: 768px) {
    margin: 0 30px;
  }
  @media screen and(max-width: 400px) {
    margin: 0 15px;
  }
  form {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.12);
    .chat-message {
      flex-grow: 1;
      border: 0;
      outline: 0;
      padding: 10px 20px;
      font-size: 14px;
    }
    button {
      background-color: white;
      outline: none;
      border: 0;
      padding: 0 20px;
      cursor: pointer;
      color: #2196f3;
      font-size: 14px;
      transition: color 0.25s ease-out;
      font-family: inherit;
      &:hover {
        color: #1976d2;
      }
    }
  }
}
</style>