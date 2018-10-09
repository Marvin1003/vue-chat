<template>
  <div :class="className">
    <div class="chat-roomlist-container">
      <ul class="chat-roomlist" ref="roomList">
        <li v-for="room in rooms.list" :key="room.name" @click="$emit('switchRoom', room.name)" :data-room="room.name">
          <span :style="{ backgroundColor: room.color }">{{ room.name.charAt(0) }}</span>
        </li>
      </ul>
      <div class="chat-roomlist-current">{{ rooms.current }}</div>
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
      return this.userList.filter(({ name }) => name.includes(this.search))
    },
    updateRoom(next, prev) {
      const prevI = this.roomList.findIndex(elem => elem.dataset.room === prev)
      const nextI = this.roomList.findIndex(elem => elem.dataset.room === next)

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
  background-color: #757575;
  span {
    transform: scale(1.2);
    box-shadow: $box-shadow--light;
  }
}
</style>
<style lang="scss" scoped>
.chat-panel-left {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 250px;
  margin-left: 70px;
  .chat-search {
    margin: 15px 0 5px 0;
    padding: 15px 20px;
    background-color: $color_gray--light;
  }
  .chat-roomlist-container {
    background-color: $color_gray--light;
    padding: 10px;
    .chat-roomlist-current {
      font-size: 18px;
      background-color: #757575;
      text-align: center;
      padding: 10px 0;
      color: $color_white;
      border-radius: 10px;
    }
    .chat-roomlist {
      display: flex;
      margin-bottom: 5px;
      li {
        border-radius: 10px;
        padding: 10px;
      }
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
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
        background-color: $color_gray--light;
      }
      cursor: pointer;
      .chat-userlist-avatar {
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