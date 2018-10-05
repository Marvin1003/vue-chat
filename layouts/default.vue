<template>
  <nuxt />
</template>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  color: $color_typography--default;
}
html,
body {
  height: 100%;
  width: 100%;
  position: fixed;
  overflow: hidden;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

::-webkit-scrollbar {
  display: none;
}

#__layout {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

input,
button {
  outline: 0;
  border: 0;
}

ul {
  padding: 0;
  list-style-type: none;
}
</style>
