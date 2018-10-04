<template>
  <div :class="className">
    <div>
      <ul>
        <li v-for="room in rooms.list" :key="room" @click="$emit('switchRoom', room)">
          {{ room }}
        </li>
      </ul>
    </div>
    <ul>
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
    },
  },
  data() {
    return {
      userList: [],
      currRoom: ''
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
.chat-panel-left {
  height: 100%;
  min-width: 250px;
  margin-left: 75px;
  @media screen and(max-width: 768px) {
    margin-left: 30px;
  }
  @media screen and(max-width: 400px) {
    margin-left: 15px;
  }

  display: flex;
  flex-direction: column;
  .chat-name {
    margin-top: 20px;
    text-align: center;
    color: white;
    padding-bottom: 5px;
    border-bottom: 1px solid white;
  }

  ul {
    padding: 0;
    overflow: scroll;
    list-style-type: none;
    li {
      cursor: pointer;
      max-width: 300px;
      background-color: #2196f3;
      color: white;
      border-radius: 100px;
      display: flex;
      align-items: center;
      padding-left: 30px;
      height: 57px;
      margin: 10px 10px 10px 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>