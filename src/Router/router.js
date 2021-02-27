import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

//解决路由重复点击报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err) 
}

const router = new VueRouter({
  // 让地址栏不显示#
  mode:'history',
  routes: [
    {
      path: '/NavigationBar',
      component:()=>import('@/components/index')
    },
    {
      path: '/*',
      component:()=>import('@/components/index')
    },{
      path: '/HomePage',
      name:'HomePage',
      component:()=>import('@/components/HomePage/index')
    },
  ]
})
export default router