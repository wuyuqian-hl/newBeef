<template>
  <header class="navHeader">
    <van-icon name="arrow-left" @click="goBack" />
    <div class="name">{{ name }}</div>
    <span>...</span>
  </header>
</template>

<script>
export default {
  // data() {
  //   return {
  //     active: this.$store.state.active,
  //   };
  // },
  props: {
    name: {
      type: String,
      default: "",
    },
    back: {
      type: String,
      default: "",
    },
  },
  methods: {
    goBack() {
      if (!this.back) {
        // this.$store.state.active = this.$router.go(-1).active;
        this.$router.go(-1);
      } else {
        this.$store.state.active = 0;
        this.$router.push({ path: this.back });
      }
      this.$emit("callback");
    },
  },
};
</script>

<style lang="less" scoped>
.navHeader {
  height: 40px;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  border-bottom: 1px solid #dcdcdc;
  .name {
    font-size: 14px;
  }
  span {
    font-weight: 790;
    line-height: 40px;
    margin-right: 10px;
  }
}
&/deep/ .van-icon {
  font-size: 18px;
  line-height: 40px;
}
</style>