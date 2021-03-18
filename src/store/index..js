import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 
const store = new Vuex.Store({
 
  state: {
    // 存储token
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    active: 0, //全局导航栏的变色管理
    count: 1, //全局购物车数量
    NewArred: true, //显示新增地址或修改地址
  },
 
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.token = user.token;
      localStorage.setItem('token', user.token);
    }
  }
});
 
export default store;