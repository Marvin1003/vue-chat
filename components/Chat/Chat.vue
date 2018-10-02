<template>
  <div class="chat">
    <panel-top className="chat-panel-top" :name="name" />
    <panel-left className="chat-panel-left" :name="name" />
    <!-- <panel-right className="chat-panel-right" :name="name" /> -->
    <Output className="chat-output" :name="name" />
    <Input className="chat-message-container" :name="name" />
    </div>
</template>

<script>
import Output from './Output/Output.vue'
import Input from './Input/Input.vue'
import PanelLeft from './Panel/Left/PanelLeft.vue'
import PanelRight from './Panel/Right/PanelRight.vue'
import PanelTop from './Panel/Top/PanelTop.vue'

var socket = null

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  async mounted() {
    socket = await import('plugins/socketio').then(mod => mod.default)

    socket.emit('joined', this.name)
  },
  components: {
    Output,
    Input,
    PanelLeft,
    PanelRight,
    PanelTop
  }
}
</script>

<style lang="scss" scoped>
.chat {
  background-color: rgba(245, 245, 245, 0.9);
  color: #212121;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  width: 80%;
  height: 70%;
  box-shadow: 0 23px 36px rgba(0,0,0,.16), 0 4px 14px rgba(0,0,0,.23);
  position: relative;
  display: grid;
  grid-template-rows: 120px repeat(2, 1fr) auto;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  grid-template-areas:
    'top top top top'
    'left output output output'
    'left output output output'
    'left input input input';

  @media screen and(max-width: 768px) {
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

  @media screen and(max-width: 400px) {
    width: 100%;
    height: calc(100% - 20px);
    margin: 10px;
    background-color: rgba(245, 245, 245, 1);
    grid-template-rows: 50px repeat(2, 1fr) auto;
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

  .chat-panel-right {
    grid-column: 4;
    grid-row: 2 / 4;
  }

  .chat-message-container {
    grid-area: input;
  }
}
</style>
