<template>
  <div :class="className">
    <h2 @click="$emit('toggleRooms')" class="chat-rooms-text">{{ chatName }}</h2>
  </div>
</template>
<script>
export default {
  props: {
    className: {
      type: String,
      default: 'chat-panel-top'
    },
    name: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    chatName: {
      type: String,
      default: 'Chat'
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-panel-top {
  display: flex;
  align-items: flex-end;
  margin: 0 75px;
  justify-content: space-between;
  padding-bottom: 20px;

  h2 {
    font-weight: normal;
  }
  .chat-rooms-text {
    cursor: pointer;
  }

  @media screen and(max-width: 768px) {
    margin: 0 30px;
    padding-bottom: 0;
    align-items: center;
  }

  @media screen and(max-width: 400px) {
    margin: 0 15px;
  }
}
</style>