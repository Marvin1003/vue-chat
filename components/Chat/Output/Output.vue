<template>
  <div :class="className">
    <div class="chat-is-typing">
      <ul v-show="isTyping.length > 0">
        <li v-for="(user, index) in isTyping" :key="index">{{ user }}</li>
        <span> is typing...</span>
      </ul>
    </div>
    <ul ref="list" @touchmove="allowScrolling">
      <li v-for="(message, index) in messages" class="chat-message-output" :key="index" :class="message.name === name ? 'chat-message-output-me' : ''">
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
    }
  },
  data() {
    return {
      messages: [],
      isTyping: []
    }
  },
  methods: {
    allowScrolling(e) {
      e.stopPropagation()
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
      this.messages.push({ text: msg, name, time })
    })

    socket.on('joined', ({ user, type }) => {
      if (user !== this.name && user) {
        this.messages.push({
          text: user,
          class: 'chat-joined_disconnected',
          type
        })
      }
    })
  },
  updated() {
    const scrollHeight = this.$refs.list.scrollHeight
    const containerHeight = this.$refs.list.clientHeight

    if (scrollHeight > containerHeight)
      this.$refs.list.scrollTop = scrollHeight - containerHeight
  }
}
</script>

<style lang="scss" scoped>
.chat-output {
  overflow: scroll;
  margin: 0 70px;
  display: flex;
  flex-direction: column;
  @media screen and(max-width: 768px) {
    margin: 0 25px;
  }

  @media screen and(max-width: 400px) {
    margin: 0 10px;
  }
  ul {
    display: flex;
    padding: 0;
    list-style-type: none;
  }

  .chat-is-typing {
    display: flex;
    color: #757575;
    font-size: 12px;
    min-height: 20px;
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
    overflow: scroll;
    flex-grow: 1;
    flex-direction: column;
    .chat-message-output {
      margin: 7.5px 5px;
      .chat-default {
        border-radius: 4px;
        overflow: hidden;
        padding: 15px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        max-width: 250px;
      }
      .chat-joined_disconnected {
        text-align: center;
        color: #757575;
        border-radius: 0;
        padding: 0;
        box-shadow: none;
        font-style: italic;
      }

      &.chat-message-output-me {
        align-self: flex-end;
        color: #fafafa;
        .chat-default {
          background-color: #2196f3;
          time {
            color: #fafafa;
          }
          .chat-message-output-name {
            color: #1a237e;
          }
        }
      }
      .chat-message-output-info {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        font-size: 10px;
      }

      .chat-message-output-name {
        display: inline-block;
        color: #f44336;
        margin-right: 10px;
      }
      time {
        color: #757575;
      }
      p {
        word-break: break-word;
      }
    }
  }
}
</style>