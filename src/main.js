// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView);
Vue.config.productionTip = false

Vue.directive('check', {
  inserted(el, binding, vnode, old) {
    if (binding.value === 'aaa') {
      vnode.elm.parentElement.removeChild(vnode.elm)
    }
  }
})
Vue.mixin({
  created() {
    console.log(this.NEEDAUTHCHECK__)
    if (this.NEEDAUTHCHECK__) {
      console.log(this, 'thhhis', this.$router)
      this.ccc_ = 111;
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
