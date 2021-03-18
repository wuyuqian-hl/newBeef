<template>
  <div>
    <sHeader :name="'登录'" :back="'/HomePage'"></sHeader>
    <div class="logo">
      <img src="../../assets/hotGoodsesImg/logo.png" alt="" />
    </div>
    <!-- 用户注册 -->
    <div>
      <!-- 登录页面 -->
      <van-form @submit="onSubmit" v-if="loginPage">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            { pattern: /^1[3456789]\d{9}$/, message: '请填入正确的手机号' },
          ]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
              message:
                '密码由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间。',
            },
          ]"
        />
        <!-- 随机验证码 -->
        <div class="randomNum">
          <input type="text" name="" v-model="verifyValue" id="" /><Verify
            @update:value="handeVerify"
          ></Verify>
        </div>
        <div class="register" @click="signUp">立即注册</div>
        <div style="margin: 16px">
          <van-button
            color="#00B1B1"
            round
            block
            type="info"
            native-type="submit"
            >登录</van-button
          >
        </div>
      </van-form>
      <!-- 注册页面 -->
      <van-form @submit="onSubmits" v-if="signUpPage">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[
            { required: true, message: '请填写用户名' },
            { pattern: /^1[3456789]\d{9}$/, message: '请填入正确的手机号' },
          ]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
              message:
                '密码由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间。',
            },
          ]"
        />
        <van-field
          v-model="newpassword"
          type="password"
          name="再次输入密码"
          label="密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
              message:
                '密码由数字和字母组成，并且要同时含有数字和字母，且长度要在8-16位之间。',
            },
          ]"
        />
        <!-- 随机验证码 -->
        <div class="randomNum">
          <input type="text" name="" v-model="verifyValue" id="" /><Verify
            @update:value="handeVerify"
          ></Verify>
        </div>
        <div class="register" @click="loginUp">已有账户，直接登录</div>
        <div style="margin: 16px">
          <van-button
            color="#00B1B1"
            round
            block
            type="info"
            native-type="submit"
            >立即注册</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import sHeader from "../public/navHeader";
import Verify from "./verify";
import debounce from "../public/debounce";
// 用来存储token值
import { mapMutations } from "vuex";
export default {
  components: {
    Verify,
    sHeader,
  },
  data() {
    return {
      username: "",
      password: "",
      newpassword: "", //再次输入密码
      loginPage: true, //登录页面
      signUpPage: false, //注册页面
      verifyValue: "", // 存储表单输入的值
      yanzhengma: "", //存储子组件传过来的随机验证码
    };
  },
  methods: {
    // 获取子组件传过来的随机验证码
    handeVerify(val) {
      this.yanzhengma = val;
    },
    // 提交数据时验证
    ...mapMutations(["changeLogin"]), //用来存储登录成功返回的token值，拿来当身份令牌
    onSubmit: debounce(function (values) {
      let _this = this;
      // 如果输入的值与随机数相同并且用户名与密码不为空
      if (this.verifyValue === this.yanzhengma && values) {
        this.$http
          .post(
            "/api/v1/user/login",
            {
              loginName: this.username,
              passwordMd5: this.$md5(this.password),
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
              // 获取存储token
              _this.userToken = res.data.data;
              //将用户token保存到vuex中
              _this.changeLogin({ token: _this.userToken });
              this.$store.state.active = 0;
              window.localStorage.setItem("token", _this.userToken);
              window.location.href = "/HomePage";
            } else {
              this.$toast({
                message: "密码或验证码错误",
                position: "top",
                duration: 3000,
              });
            }
          })
          .catch((error) => {
            this.$toast({
              message: "密码或验证码错误",
              position: "top",
              duration: 3000,
            });
            console.log(error);
          });
      } else {
        this.$toast({
          message: "验证码错误，请重新输入",
          position: "bottom",
          duration: 3000,
        });
      }
    }, 1000),
    //登录页面点击立即注册时
    signUp() {
      //登录页面隐藏，注册页面显示
      this.loginPage = false;
      this.signUpPage = true;
    },
    //注册页面点击已有账户直接登录时
    loginUp() {
      //注册页面隐藏，登录页面显示
      this.loginPage = true;
      this.signUpPage = false;
    },
    // 注册页面点击注册按钮 已成功
    onSubmits: debounce(function (values) {
      // 如果输入的值与随机数相同并且用户名与密码不为空
      if (
        this.verifyValue === this.yanzhengma &&
        values &&
        this.password === this.newpassword
      ) {
        this.$http
          .post(
            "/api/v1/user/register",
            {
              loginName: this.username,
              password: this.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((res) => {
            console.log(res);
            if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
              window.location.href = "/HomePage";
            } else {
              this.$toast({
                message: "用户名已存在！",
                position: "top",
                duration: 3000,
              });
            }
          });
      } else {
        this.$toast({
          message: "验证码错误，请重新输入",
          position: "bottom",
          duration: 3000,
        });
      }
    }, 1000),
    // 当二次密码输入失去焦点是触发校验
  },
};
</script>

<style lang="less" scoped>
.logo {
  height: 150px;
  text-align: center;
  line-height: 150px;
}
// 立即注册
.register {
  font-size: 12px;
  margin-left: 20px;
  margin-top: 20px;
  color: #008bfa;
}
// 随机验证码
.randomNum {
  display: flex;
  padding-top: 10px;
  padding-left: 20px;
  input {
    border: 1px solid #efefef;
    border-radius: 8px;
  }
}
</style>