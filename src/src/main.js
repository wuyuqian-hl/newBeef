import Vue from 'vue'
import App from './App.vue'
//引入vant
import Vant from 'vant'
import 'vant/lib/index.css'
//引入路由
import router from './Router/router'
//引入axios发送请求
import axios from 'axios'
//将axios注册成全局的$http
Vue.prototype.$http = axios;
axios.defaults.baseURL='http://123.207.223.107:10000/'
Vue.use(Vant);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  //注册路由
  router
}).$mount('#app')
