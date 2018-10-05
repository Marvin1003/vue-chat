const path = require('path')
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */

  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Fredoka+One'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Lato'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       data: '@import "styles/_vars.scss";'
  //     }
  //   }
  // },
  // css: ['~assets/styles/_vars.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/gsap'],

  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'scss',
  //     patterns: [path.resolve(__dirname, 'styles/_vars.scss')]
  //   }
  // },

  /*
  ** Nuxt.js modules
  */

  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    [
      'nuxt-sass-resources-loader',
      // These styles get imported in every css without having to explicity @import("variables.scss") them. Useful for variables - mixins
      path.resolve(__dirname, 'assets/styles/_vars.scss')
    ]
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.resolve.alias.components = path.resolve(__dirname, 'components')
      config.resolve.alias.plugins = path.resolve(__dirname, 'plugins')
      config.resolve.alias.assets = path.resolve(__dirname, 'assets')

      return config
    }
  }
}
