<template>
  <div>
    <sHeader :name="'账号管理'"></sHeader>
    <van-loading size="34px" v-height="155" vertical v-if="loading"></van-loading>
    <div class="account" v-if="!loading">
      <van-form @submit="onSubmit">
        <van-field v-model="text" name="昵称" label="昵称" />
        <van-field v-model="signature" name="个性签名" label="个性签名" />
        <van-field
          placeholder="密码由数字与字母组成"
          v-model="password"
          type="password"
          name="修改密码"
          label="修改密码"
        />
        <div>
          <van-button block type="info" native-type="submit">提交</van-button>
          <van-button block type="info" @click="logOut">退出登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import sHeader from "../public/navHeader";
export default {
  components: {
    sHeader,
  },
  data() {
    return {
      text: this.$route.query.nickName, //昵称
      signature: this.$route.query.introduceSign, //个性签名
      password: "", // 密码
      loading:false,
    };
  },
  methods: {
    // 提交修改信息
    onSubmit() {
      this.loading = true;
      this.$http
        .put("/api/v1/user/info", {
          introduceSign: this.signature,
          nickName: this.text,
          passwordMd5: this.$md5(this.password),
        })
        .then((res) => {
          this.loading = false;
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.$toast.success("修改成功");
          }
        });
    },
    // 退出登录清除token
    logOut() {
      this.$http.post("/api/v1/user/logout").then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          // 退出登录，清除token
          this.$toast.success("退出成功");
          this.$store.state.active = 0;
          this.$router.push("/");
        }
        console.log(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading{
  padding-top: 300px;
}
.account {
  width: calc(100% - 80px);
}
&/deep/ .van-button {
  margin: 15px 40px;
  background: #00b1b1;
  border: 1px solid #00b1b1;
}
</style>