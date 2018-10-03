<template>
  <div class="chat-container">
    <Chat v-if="showChat" :name="name" />
    <your-name @toggle="toggle" v-else :name="name" :showChat="showChat" />
  </div>
</template>

<script>
import Chat from 'components/Chat/Chat.vue'
import YourName from 'components/Chat/YourName/YourName.vue'

export default {
  components: {
    Chat,
    YourName
  },
  methods: {
    toggle(name) {
      this.name = name
      this.showChat = true
    },
    preventDefault(e) {
      e.preventDefault()
    }
  },
  mounted() {
    window.addEventListener('touchmove', this.preventDefault, {
      passive: false
    })
  },
  data() {
    return {
      showChat: false,
      name: null
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-container {
  font-family: 'Lato', sans-serif;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url('../assets/images/wallpaper.jpg');
  background-size: cover;
  background-position: center;
}
</style>
