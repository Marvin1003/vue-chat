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
      const name = this.name.trim()
      if (this.name && name.length >= 2) {
        socket.emit('validate', this.name)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-your-name-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 30px 50px;
  background-color: $color_white;
  border-radius: $border-radius--primary;
  box-shadow: $box-shadow--primary;
  overflow: hidden;

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-weight: normal;
  }

  .chat-error-name-used {
    color: $color_red--default;
    text-align: center;
    margin-top: 20px;
  }
  form {
    display: flex;
    overflow: hidden;
    border-radius: inherit;
    input {
      padding: 10px;
      min-width: 200px;
      font-size: 14px;
    }
    button {
      min-width: 60px;
      color: $color_blue--default;
      font-size: 14px;
      font-family: inherit;
      text-transform: uppercase;
      transition: color 0.25s ease-out;
      border-left: 1px $color-gray--light;
      cursor: pointer;
      &:hover {
        color: $color_blue--hover;
      }
    }
  }

  @media screen and(max-width: 400px) {
    form {
      flex-direction: column;
      justify-content: center;
    }
    button {
      height: 33px;
      min-width: auto !important;
      margin-top: 20px;
      padding: 0 20px;
      align-self: center;
      color: $color_white !important;
      background-color: $color_blue--default;
      border-radius: inherit;
    }
  }
}
</style>