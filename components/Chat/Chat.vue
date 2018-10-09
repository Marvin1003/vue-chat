<template>
  <div class="chat">
    <panel-top className="chat-panel-top" :name="name" :room="rooms.current" @toggleRooms="toggleRooms" />
    <panel-left className="chat-panel-left" @switchRoom="switchRoom" :name="name" :rooms="rooms" />
    <Output className="chat-output" :name="name" :room="rooms.current" />
    <Input className="chat-message-container" :name="name" :room="rooms.current" />
  </div>
</template>

<script>
import colors from 'assets/google/colors.json'

import Output from './Output/Output.vue'
import Input from './Input/Input.vue'
import PanelLeft from './Panel/Left/PanelLeft.vue'
import PanelTop from './Panel/Top/PanelTop.vue'

var socket = null
const roomColors = Object.keys(colors).map(key => colors[key][500])

let rooms = ['General', 'Work', 'Developer', 'Fun', 'NSFW']
rooms = rooms.map((roomName, i) => ({ name: roomName, color: roomColors[i] }))

export default {
  components: {
    Output,
    Input,
    PanelLeft,
    PanelTop
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rooms: {
        list: rooms,
        current: 'General'
      }
    }
  },
  methods: {
    switchRoom(room) {
      if (room !== this.rooms.current) {
        socket.emit('switch room', {
          prevRoom: this.rooms.current,
          nextRoom: room,
          name: this.name
        })

        this.rooms.current = room
      }
      if (this.$el.classList.contains('chat-rooms-toggle'))
        this.$el.classList.remove('chat-rooms-toggle')
    },
    toggleRooms() {
      if (window.innerWidth <= 992)
        this.$el.classList.toggle('chat-rooms-toggle')
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)
    socket.emit('joined', { name: this.name, room: this.rooms.current })
  }
}
</script>


<style lang="scss" scoped>
.chat {
  width: 90%;
  height: 80%;
  position: relative;
  display: grid;
  grid-template-rows: 60px repeat(2, 1fr) auto;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  grid-template-areas:
    'left top top top'
    'left output output output'
    'left output output output'
    'left input input input';

  background-color: $color_white;
  box-shadow: $box-shadow--primary;
  border-radius: $border-radius--primary;
  overflow: hidden;

  @media screen and(max-width: 991px) {
    grid-template-areas:
      'top top top top'
      'output output output output'
      'output output output output'
      'input input input input';

    .chat-panel-left {
      display: none;
      grid-area: left;
    }
  }

  @media screen and(max-width: 399px) {
    width: 100%;
    height: calc(100% - 20px);
    margin: 10px;
    background-color: $color_white;
    .chat-panel-left {
      display: none;
      grid-area: left;
    }
  }
  .chat-output {
    grid-area: output;
  }

  .chat-panel-top {
    grid-area: top;
  }

  .chat-panel-left {
    grid-area: left;
  }

  .chat-message-container {
    grid-area: input;
  }
}
</style>

<style lang="scss">
.chat-rooms-toggle {
  .chat-panel-left {
    height: calc(100% - 10px);
    grid-column: 1 / 5 !important;
    grid-row: 2 / 5 !important;
    display: block !important;
    margin: 0 10px !important;
    border-radius: $border-radius--primary;
    .chat-roomlist-container {
      margin-top: 25px;
    }
    h2 {
      display: none;
    }
    li {
      margin: 10px auto !important;
    }
  }
  .chat-output {
    display: none;
  }
  .chat-message-container {
    display: none;
  }
}
</style>