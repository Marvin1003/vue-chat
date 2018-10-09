<template>
  <div :class="className">
    <div class="chat-is-typing">
      <div>
        <ul v-show="isTyping.length > 0">
          <li v-for="(user, index) in isTyping" :key="index">{{ user }}</li>
          <span> is typing...</span>
        </ul>
      </div>
      <div @click="$emit('toggleRooms')" class="chat-button">M</div>
    </div>
  </div>
</template>
<script>
var socket = null

export default {
  props: {
    className: {
      type: String,
      default: 'chat-panel-top'
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
  data() {
    return {
      isTyping: [],
      isTouching: false,
      threshold: 150
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.on('isTyping', user => {
      if (user.name !== this.name) {
        if (user.isTyping && !this.isTyping.includes(user.name))
          this.isTyping.push(user.name)
        else if (!user.isTyping)
          this.isTyping = this.isTyping.filter(name => name !== user.name)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.chat-panel-top {
  margin: 0 50px;
  display: flex;
  align-items: center;
  .chat-is-typing {
    flex-grow: 1;
    background-color: $color_gray--light;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    color: $color_gray--dark;
    font-size: 12px;
    border-radius: $border-radius--primary;
    .chat-button {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      width: 70px;
      min-height: 30px;
      margin-right: 5px;
      background-color: $color_menu;
      border-radius: $border-radius--primary;
      @media screen and(min-width: 992px) {
        display: none;
      }
    }
    ul {
      max-width: 50%;
      overflow: scroll;
      span {
        white-space: pre;
      }

      li:not(:last-of-type)::after {
        content: ', ';
        white-space: pre;
      }
    }
  }
  @media screen and(max-width: 768px) {
    margin: 0 25px;
  }
  @media screen and(max-width: 399px) {
    margin: 0 10px;
  }
}
</style>