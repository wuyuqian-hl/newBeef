import Vue from 'vue'
import App from './App.vue'
import store from './store/index.'
//引入vant
import Vant from 'vant'
import Toast from 'vant/lib/toast'
import 'vant/lib/index.css'
// 引入自适应高度
import Directive from './Directive/directive'
Vue.use(Directive);
//引入路由
import router from './Router/router'
//引入axios发送请求
import axios from 'axios'
// MD5之密码加密
import md5 from 'js-md5';
import { prefix } from '../src/components/public/UrlPic'
Vue.prototype.prefix = prefix;
// qs是转换请求体中的内容
import qs from 'qs'
axios.defaults.headers.post["Content-Type"] ="application/json;charset=UTF-8"; //配置请求头
//将axios注册成全局的$http
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$md5 = md5;
//将轻提示注册成全局组件
Vue.prototype.$toast = Toast;
// 添加请求拦截器，在请求头中加token
axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.baseURL='https://www.huangkeyan.cn/'
Vue.use(Vant);
Vue.config.productionTip = false
// 监听本地存储删除刷新页面
// window.addEventListener('storage', function (e) {
//   //这个e返回的是哪个值被更改，更改后的值跟更改之前的值
//   console.log(e,)
  
//   if (localStorage.getItem("token")) {
//  //这里是判断本地存储token存在的时候写的逻辑
//   } else {
//     location.reload();
//     //这里是判断本地存储token不存在的时候写的逻辑，这里可以让他跳转到登陆页面
//   }
// })
new Vue({
  render: h => h(App),
  //注册路由
  router,
  store
}).$mount('#app')
