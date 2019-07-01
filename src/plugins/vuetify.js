import Vue from 'vue'
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import VuetifyToast from 'vuetify-toast-snackbar'

Vue.use(Vuetify, {
  iconfont: 'md',
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
})

Vue.use(VuetifyToast,
  {
    x: 'center', // default
    y: 'top', // default
    color: 'info', // default
    icon: 'info',
    classes: [
      'body-2'
    ],
    timeout: 3000, // default
    dismissable: true, // default
    autoHeight: false, // default
    multiLine: false, // default
    vertical: false, // default
    queueable: false, // default
    showClose: false, // default
    shorts: {
      custom: {
        color: 'purple'
      }
    },
    property: '$toast' // default
  })
