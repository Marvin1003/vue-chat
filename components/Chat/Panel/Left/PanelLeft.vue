<template>
  <div :class="className">
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
  // background: #00b09b; /* fallback for old browsers */
  // background: -webkit-linear-gradient(
  //   to top,
  //   #96c93d,
  //   #00b09b
  // ); /* Chrome 10-25, Safari 5.1-6 */
  // background: linear-gradient(
  //   to top,
  //   #96c93d,
  //   #00b09b
  // ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

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
      background-color: white;
      border-radius: 2px;
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