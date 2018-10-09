<template>
  <div :class="className">
    <div class="chat-is-typing">
      <ul v-show="isTyping.length > 0">
        <li v-for="(user, index) in isTyping" :key="index">{{ user }}</li>
        <span> is typing...</span>
      </ul>
    </div>
    <ul v-show="messages[this.room]" ref="list" @touchstart="isTouching = true" @touchend="isTouching = false">
      <li v-for="(message, index) in messages[this.room]" class="chat-message-output" :key="index" :class="message.name === name ? 'chat-message-output-me' : ''">
        <div v-if="!message.class" class="chat-default">
          <div class="chat-message-output-info"><span class="chat-message-output-name">{{ message.name }}</span><time>{{ message.time }}</time></div>
          <p>{{ message.text }}</p>
        </div>
        <div v-else :class="message.class">
          {{ message.text }} {{ message.type }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
var socket = null

export default {
  props: {
    className: {
      type: String,
      default: 'chat-output'
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
      messages: {},
      isTyping: [],
      isTouching: false,
      threshold: 150,
      prevScrollHeight: 0
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

    socket.on('message', ({ msg, name, time }) => {
      if (!this.messages[this.room]) this.$set(this.messages, this.room, [])
      this.messages[this.room].push({ text: msg, name, time })
    })

    socket.on('roomChange', ({ user, type }) => {
      if (user !== this.name && user) {
        if (!this.messages[this.room]) this.$set(this.messages, this.room, [])
        this.messages[this.room].push({
          text: user,
          class: 'chat-joined_disconnected',
          type: type.toLowerCase()
        })
      }
    })
  },
  updated() {
    const scrollHeight = this.$refs.list.scrollHeight
    const containerHeight = this.$refs.list.clientHeight
    const currY = this.$refs.list.scrollTop
    const bottom = this.prevScrollHeight - containerHeight

    if (
      !this.isTouching &&
      scrollHeight > containerHeight &&
      currY > bottom - this.threshold
    )
      this.$refs.list.scrollTop = scrollHeight - containerHeight

    this.prevScrollHeight = scrollHeight
  }
}
</script>

<style lang="scss" scoped>
.chat-output {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0 70px;
  ul {
    display: flex;
  }
  .chat-is-typing {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30px;
    margin: 0 5px;
    color: $color_gray--dark;
    font-size: 12px;
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
  > ul {
    flex-direction: column;
    flex-grow: 1;
    overflow: scroll;
    .chat-message-output {
      margin: 7.5px 5px;
      .chat-default {
        max-width: 250px;
        padding: 15px;
        border-radius: 4px;
        overflow: hidden;
        background-color: $color_white;
        box-shadow: $box-shadow--light;
      }
      .chat-joined_disconnected {
        padding: 0;
        border-radius: 0;
        color: $color_gray--dark;
        font-style: italic;
        text-align: center;
        box-shadow: none;
      }

      &.chat-message-output-me {
        align-self: flex-end;
        color: $color_white;
        .chat-default {
          background-color: $color_blue--default;
          time {
            color: $color_gray--light;
          }
          .chat-message-output-name {
            color: $color_blue--hover;
          }
        }
      }
      .chat-message-output-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        font-size: 10px;
      }

      .chat-message-output-name {
        display: inline-block;
        margin-right: 10px;
        color: $color_red--default;
      }
      time {
        color: $color_gray--dark;
      }
      p {
        word-break: break-word;
      }
    }
  }
  @media screen and(max-width: 768px) {
    margin: 0 25px;
  }

  @media screen and(max-width: 400px) {
    margin: 0 10px;
  }
}
</style>