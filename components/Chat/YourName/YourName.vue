<template>
  <div class="chat-your-name-container">
    <h2>Your Name</h2>
    <form @submit="validate" class="chat-your-name">
      <input type="text" v-model="name" />
      <button>chat</button>
    </form>
    <small v-if="showError" class="chat-error-name-used">{{ error }}</small>
  </div>
</template>

<script>
var socket = null

export default {
  data() {
    return {
      name: '',
      error: 'This username is already in use',
      showError: false
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.on('validate', allowed => {
      if (allowed) this.$emit('toggle', this.name)
      else this.showError = true
    })
  },
  methods: {
    validate(e) {
      e.preventDefault()
      if (this.name.length >= 2) {
        socket.emit('validate', this.name)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-your-name-container {
  background-color: rgba(245, 245, 245, 0.9);
  padding: 30px 50px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and(max-width: 400px) {
    form {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    button {
      align-self: center;
      background-color: #2196f3;
      color: white !important;
      margin-top: 20px;
      height: 33px;
      padding: 0 20px;
      min-width: auto !important;

      border-radius: 4px;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: normal;
  }

  .chat-error-name-used {
    color: #f44336;
    text-align: center;
    margin-top: 20px;
  }
  form {
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    input,
    button {
      outline: 0;
      border: 0;
    }
    input {
      padding: 10px;
      min-width: 200px;
      font-size: 14px;
    }
    button {
      cursor: pointer;
      border-left: 1px #e0e0e0;
      color: #2196f3;
      font-size: 14px;
      min-width: 60px;
      font-family: inherit;
      transition: color 0.25s ease-out;
      text-transform: uppercase;
      &:hover {
        color: #1976d2;
      }
    }
  }
}
</style>