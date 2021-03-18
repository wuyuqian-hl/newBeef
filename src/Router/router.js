
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
  mode: 'history',
  routes: [
    {
      // 登录页面
      path: '/Login',
      component: () => import('@/components/Login/index')
    },
    , {
      // 首页
      path: '/HomePage',
      name: 'HomePage',
      component: () => import('@/components/HomePage/index'),
      
    },
    {
      // 首页
      path: '/HomePage',
      name: 'HomePage',
      component: () => import('@/components/HomePage/index'),
      
    },
    {
      // 底部导航
      path: '/NavigationBar',
      component: () => import('@/components/index')
    }, {
      // 分类页
      path: '/Classify',
      name: 'Classify',
      component: () => import('@/components/Classify/index')
    }, {
      // 分类的搜索页
      path: '/SearchCommodity',
      name: 'SearchCommodity',
      component: () => import('@/components/Classify/search')
    }, {
      // 购物车页面
      path: '/ShoppingTrolley',
      name: 'ShoppingTrolley',
      component: () => import('@/components/ShoppingTrolley/index'),
      requireAuth:true,
      
    }, {
      // 提交订单
      path: '/SubmitOrder',
      name: 'SubmitOrder',
      component: () => import('@/components/ShoppingTrolley/SubmitOrder')
    },
    {
      // 至订单页面
      path: '/OrderForm',
      name: 'OrderForm',
      component: () => import('@/components/ShoppingTrolley/OrderForm')
    },
    
    {
      // 新增地址页面
      path: '/addSite',
      name: 'addSite',
      component: () => import('@/components/ShoppingTrolley/addSite')
    }, {
      // 商品详情页面
      path: '/ShopDetail',
      name: 'ShopDetail',
      component: () => import('@/components/ShopDetail/index')
    },{
      // 我的设置
      path: '/MySet',
      name: 'MySet',
      component: () => import('@/components/MySet/index')
    },{
      // 我的订单
      path: '/MyShopList',
      name: 'MyShopList',
      component: () => import('@/components/MySet/MyShopList')
    },{
      // 订单详情
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: () => import('@/components/MySet/OrderDetails')
    },{
      // 账号管理
      path: '/AccountManagement',
      name: 'AccountManagement',
      component: () => import('@/components/MySet/AccountManagement')
    },{
      // 关于我们
      path: '/AboutWo',
      name: 'AboutWo',
      component: () => import('@/components/MySet/AboutWo')
    },
    {
      // 没有页面就跳转到首页
      path: '*',
      component: () => import('@/components/HomePage/index')
    },
  ]
});

export default router