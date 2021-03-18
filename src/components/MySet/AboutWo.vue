<template>
  <div>
    <sHeader :name="'关于我们'"></sHeader>
    <div>
      <van-divider
        :style="{
          color: '#00B1B1',
          borderColor: '#00B1B1',
          fontSize: '20px',
          padding: '0 16px',
        }"
      >
        简介
      </van-divider>
      <van-divider
        :style="{
          color: '#00B1B1',
          borderColor: '#00B1B1',
          fontSize: '20px',
          padding: '0 16px',
        }"
      >
      </van-divider>
    </div>
  </div>
</template>

<script>
import sHeader from "../public/navHeader";
export default {
  components: {
    sHeader,
  },
};
</script>

<style lang="less" scoped>
</style>