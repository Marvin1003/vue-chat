<template>
  <div :class="className">
    <div>
      <ul class="chat-roomlist">
        <li v-for="room in rooms.list" :key="room" @click="$emit('switchRoom', room)">
          {{ room }}
        </li>
      </ul>
    </div>
    <ul class="chat-userlist">
      <li v-for="user in userList" :key="user.id">
        {{user.name }}
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
    },
    rooms: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userList: [],
      currRoom: ''
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.on('roomChange', ({ userList }) => {
      this.userList = userList
    })
  }
}
</script>
<style lang="scss" scoped>
.chat-panel-left {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 250px;
  margin-left: 70px;
  .chat-name {
    margin-top: 20px;
    padding-bottom: 5px;
    text-align: center;
    color: $color_typography--white;
    border-bottom: 1px solid $color_typography--white;
  }
  .chat-roomlist li {
    color: $color_typography--white;
    background-color: $color_blue--default;
  }
  ul {
    overflow: scroll;
    li {
      display: flex;
      align-items: center;
      height: 57px;
      max-width: 300px;
      margin: 10px 5px;
      padding-left: 30px;
      border-radius: 100px;

      background-color: $color_typography--white;
      box-shadow: $box-shadow--light;
      cursor: pointer;
    }
  }

  @media screen and(max-width: 768px) {
    margin-left: 30px;
  }
  @media screen and(max-width: 400px) {
    margin-left: 15px;
  }
}
</style>