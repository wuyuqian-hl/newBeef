<template>
  <div>
    <!-- 设置头 -->
    <sHeader :name="'我的'"></sHeader>
    <!-- 内容 -->
    <van-loading
      size="34px"
      v-height="155"
      vertical
      v-if="loading"
    ></van-loading>
    <div v-if="!loading">
      <div class="card">
        <div class="cardinfo">
          <div class="info">
            <div class="cardpic">
              <img
                src="//s.weituibao.com/1583583975067/user-graduate%20(1).png"
                alt=""
              />
              <div>
                <span>昵称：{{ Userdata.nickName }}</span>
                <span>登录名：{{ Userdata.loginName }}</span>
                <span>个性签名：{{ Userdata.introduceSign }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul class="myshop">
        <li @click="myShopList">
          <p>我的订单</p>
          <van-icon name="arrow" />
        </li>
        <li @click="AccountManagement">
          <p>账号管理</p>
          <van-icon name="arrow" />
        </li>
        <li @click="siteAddress">
          <p>地址管理</p>
          <van-icon name="arrow" />
        </li>
        <li @click="AboutWo">
          <p>关于我们</p>
          <van-icon name="arrow" />
        </li>
      </ul>
    </div>
    <Navbar></Navbar>
  </div>
</template>

<script>
import sHeader from "../public/navHeader";
import Navbar from "../index";
export default {
  components: {
    Navbar,
    sHeader,
  },
  data() {
    return {
      Userdata: [],
      loading: false,
      active: 3,
    };
  },
  created() {
    this.getUserinfo();
    this.getuserList();
  },
  methods: {
    // 判断用户是否登录
    getuserList() {
      this.loading = true;
      // 获取用户是否登录状态，如果不是，跳到登录页面，如果就，就直接到购物车页面
      this.$http.get("/api/v1/user/info").then((res) => {
        if (res.data.message == "未登录！" || res.data.resultCode !== 200) {
          this.$toast({
            message: "未登录，请先登录",
            position: "bottom",
            duration: 3000,
          });
          this.$router.push("/Login");
        } else if (
          res.data.message == "SUCCESS" &&
          res.data.resultCode == 200
        ) {
          this.$store.state.active = 3;
          this.$router.push("/MySet");
          this.loading = false;
        }
      });
    },
    // 获取用户信息
    getUserinfo() {
      this.$http
        .get("/api/v1/user/info")
        .then((res) => {
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.Userdata = res.data.data;
          } else {
            console.log("错误");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 我的订单
    myShopList() {
      this.$router.push("/MyShopList");
    },
    // 账号管理
    AccountManagement() {
      let obj = {
        path: "/AccountManagement",
        query: {
          nickName: this.Userdata.nickName,
          introduceSign: this.Userdata.introduceSign,
        },
      };
      this.$router.push(obj);
    },
    // 地址管理
    siteAddress() {
      this.$router.push("/SubmitOrder");
    },
    // 关于我们
    AboutWo() {
      this.$router.push("/AboutWo");
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  padding-top: 300px;
}
// 用户信息
.card {
  height: 140px;
  width: 100%;
  .cardinfo {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 0px 10px;
    padding-top: 5px;
    padding-bottom: 25px;
    .info {
      width: 100%;
      height: 100%;
      background: #1eb0b0;
      border-radius: 8px;
      vertical-align: middle;
      .cardpic {
        padding: 25px 20px;
        display: flex;
        img {
          width: 60px;
          height: 60px;
        }
        div {
          color: #fff;
          font-size: 14px;
          padding-left: 15px;
          span {
            display: inline-block;
            width: 100%;
            padding-bottom: 5px;
          }
        }
      }
    }
  }
}
// 我的订单
.myshop {
  padding: 0 20px;
  li {
    height: 40px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 14px;
    color: #2c3e50;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
  }
}
&/deep/ .van-icon-arrow {
  line-height: 40px;
}
</style>