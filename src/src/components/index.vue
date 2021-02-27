<template>
  <div>
    <van-tabbar v-model="active" @change="changeRouter">
      <van-tabbar-item icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
    <div v-if='Home'>
      <component :is="Home"></component>
    </div>
  </div>
</template>

<script>
  export default {
    components:{
      HomePage:()=>import('@/components/HomePage/index')
    },
    data(){
      return {
        active:0,
        Home:'HomePage'
      }
    },
    methods:{
      changeRouter(active){
        if(active == 0){
          this.HomePage = 'HomePage';
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>