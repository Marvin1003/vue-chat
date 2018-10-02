<template>
  <div :class="className">
    <ul>
      <li v-for="user in userList" :key="user">
        {{user}}
      </li>
    </ul>
  </div>
</template>
<script>
var socket = null

export default {
  props: {
    name: {
      type: String
    },
    className: {
      type: String,
      default: 'chat-panel-left'
    }
  },
  data() {
    return {
      userList: []
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.on('joined', ({ userList }) => {
      this.userList = userList
    })
  }
}
</script>
<style lang="scss" scoped>
.chat-panel-right {
  height: 100%;
  ul {
    list-style-type: none;
    li {
      padding: 10px 15px;
      border-radius: 20px;
      background-color: #f5f5f5;
      margin: 10px;
    }
  }
  .chat-name {
    margin-top: 20px;
    text-align: center;
    font-family: 'Fredoka One', cursive;
  }
}
</style>