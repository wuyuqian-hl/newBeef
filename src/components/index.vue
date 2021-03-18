<template>
  <div>
    <transition name="van-slide-left">
      <div v-show="visible">
        <van-tabbar v-model="active">
          <van-tabbar-item icon="wap-home-o" @click="HomePage"
            >首页</van-tabbar-item
          >
          <van-tabbar-item icon="search" @click="Classify"
            >分类</van-tabbar-item
          >
          <van-tabbar-item
            icon="shopping-cart-o"
            v-if="shopshu == 0"
            @click="ShoppingTrolley"
            >购物车</van-tabbar-item
          >
          <van-tabbar-item
            icon="shopping-cart-o"
            v-if="shopshu !== 0"
            :badge="shopshu"
            @click="ShoppingTrolley"
            >购物车</van-tabbar-item
          >
          <van-tabbar-item icon="setting-o" @click="Myset"
            >我的</van-tabbar-item
          >
        </van-tabbar>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  components: {
    HomePage: () => import("@/components/HomePage/index"),
    Classify: () => import("@/components/Classify/index"),
    ShoppingTrolley: () => import("@/components/ShoppingTrolley/index"),
  },
  data() {
    return {
      active: this.$store.state.active,
      shopList: [],
      shopshu: 0,
      visible: true,
    };
  },
  created() {
    this.getshopList();
  },
  // mounted(){
  //   const token = this.
  // },
  methods: {
    HomePage() {
      this.$store.state.active = 0;
      this.$router.push("/HomePage");
    },
    Classify() {
      this.$store.state.active = 1;
      this.$router.push("/Classify");
    },
    ShoppingTrolley() {
      this.$store.state.active = 2;
      this.$router.push("/ShoppingTrolley");
    },
    Myset() {
      this.$store.state.active = 3;
      this.$router.push("/MySet");
    },
    // 获取商品数量
    getshopList() {
      this.$http.get("/api/v1/shop-cart").then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          this.shopList = res.data.data;
          if (this.shopList) {
            for (var i in this.shopList) {
              this.shopshu += i.length;
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>