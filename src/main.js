import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

/*
我们首先需要实例化路由 router，Vue 注册号之后，要使用 router-view 组件显示路由内容
 */
