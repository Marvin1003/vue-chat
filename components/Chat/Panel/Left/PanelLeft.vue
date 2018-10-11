<template>
  <div :class="className">
    <h2>Pixelpark Chat</h2>
    <div class="chat-roomlist-container">
      <ul class="chat-roomlist" ref="roomList">
        <li v-for="room in rooms.list" :key="room.name" @click="$emit('switchRoom', room.name)" :data-room="room.name"  :style="{ backgroundColor: room.color }">
          {{ room.name.charAt(0) }}
        </li>
      </ul>
      <div ref="currentRoom" class="chat-roomlist-current">{{ rooms.current }}</div>
    </div>
    <input class="chat-search" type="Search" placeholder="Search" v-model="search" />
    <ul class="chat-userlist">
      <li v-for="user in filterSearch()" :key="user.id">
        <span class="chat-userlist-avatar" :style="{ backgroundColor: user.color }">{{ user.name.charAt(0) }}</span><span>{{user.name }}</span>
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
      search: ''
    }
  },
  computed: {
    roomList() {
      return [...this.$refs.roomList.childNodes]
    }
  },
  watch: {
    'rooms.current'(next, prev) {
      this.updateRoom(next, prev)
    }
  },
  methods: {
    filterSearch() {
      return this.userList.filter(({ name }) =>
        name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    updateRoom(next, prev) {
      const prevI = this.roomList.findIndex(elem => elem.dataset.room === prev)
      const nextI = this.roomList.findIndex(elem => elem.dataset.room === next)

      const color = this.roomList[nextI].style.backgroundColor

      this.$refs.currentRoom.style.backgroundColor = color

      prevI !== -1 &&
        this.roomList[prevI].classList.remove('chat-roomlist--active')
      nextI !== -1 &&
        this.roomList[nextI].classList.add('chat-roomlist--active')
    }
  },
  async mounted() {
    this.updateRoom(this.rooms.current, -1)

    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.on('roomChange', ({ userList }) => {
      this.userList = userList
    })
  }
}
</script>

<style lang="scss">
.chat-roomlist--active {
  transform: scale(1.3);
  box-shadow: $box-shadow--light;
}
</style>
<style lang="scss" scoped>
.chat-panel-left {
  background-color: $color_gray--light;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 250px;
  padding: 0 50px;
  h2 {
    margin: 50px 0;
    font-weight: normal;
  }
  .chat-search {
    width: 100%;
    margin: 15px 0 5px 0;
    padding: 15px 20px;
  }
  .chat-roomlist-container {
    .chat-roomlist-current {
      font-size: 18px;
      background-color: #757575;
      text-align: center;
      padding: 10px 0;
      color: $color_white;
      border-radius: $border-radius--primary;
    }
    .chat-roomlist {
      display: flex;
      margin-bottom: 5px;
      overflow-y: hidden;
      li {
        margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 30px;
        min-height: 30px;
        color: $color_white;
        background-color: $color_blue--default;
        border-radius: 100%;
        transition: all 0.2s ease-out;
        cursor: pointer;
      }
    }
  }
  ul {
    overflow: scroll;
  }
  .chat-userlist {
    li {
      display: flex;
      align-items: center;
      height: 50px;
      margin: 10px 0;
      padding-left: 10px;
      border-radius: 10px;
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
      &:hover {
        background-color: $color_white;
      }
      cursor: pointer;
      .chat-userlist-avatar {
        text-transform: uppercase;
        height: 35px;
        width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
        background-size: cover;
        background-position: center;
        border-radius: 100%;
        color: white;
      }
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