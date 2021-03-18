<template>
  <div>
    <!-- 导航头 -->
    <sHeader :name="'生成订单'"></sHeader>
    <!-- 地址信息 -->

    <div class="Address van-contact-card" @click="goAddressList">
      <div class="UserInfo">
        <div class="namePhone">{{ name }} {{ tel }}</div>
        <div class="addres">{{ address }}</div>
      </div>
      <van-icon class="icon" name="arrow" />
    </div>
    <!-- 商品信息 -->
    <van-loading
      size="34px"
      v-height="155"
      vertical
      v-if="loading"
    ></van-loading>
    <div class="shopDeail" v-if="!loading">
      <div class="shopinfo" v-for="(item, index) in shopList" :key="index">
        <img :src="prefix(item.goodsCoverImg)" alt="" />
        <div class="info">
          <div class="top">
            <h3>{{ item.goodsName }}</h3>
            <span class="cur">X{{ item.goodsCount }}</span>
          </div>
          <div class="bottom">
            <span>￥{{ item.sellingPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部结算区 -->
    <div class="statement">
      <div class="money">
        <h3>商品金额</h3>
        <p>￥{{ total }}</p>
      </div>
      <div>
        <van-button type="default" block @click="submit">生成订单</van-button>
        <van-action-sheet @close="quxiao" v-model="show" title="请选择支付方式">
          <div class="content">
            <van-button type="info" block @click="Alipay(1)"
              >支付宝支付</van-button
            >
            <van-button type="primary" block @click="Alipay(2)"
              >微信支付</van-button
            >
          </div>
        </van-action-sheet>
      </div>
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
      name: this.$route.query.name,
      tel: this.$route.query.tel,
      address: this.$route.query.address,
      shopList: [], //商品信息
      show: false,
      ddh: "",
      loading: false,
    };
  },
  created() {
    this.getshopList();
  },
  methods: {
    // 生成订单
    submit() {
      this.show = true;
      this.$http
        .post("/api/v1/saveOrder", {
          addressId: this.$route.query.addressId,
          cartItemIds: this.$route.query.cartItemIds,
        })
        .then((res) => {
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.ddh = res.data.data;
          }
        });
    },
    // 通过id来获取购物项明细
    getshopList() {
      // let params = this.$route.query.cartItemIds
      this.loading = true;
      const qs = require("qs");
      this.$http
        .get("/api/v1/shop-cart/settle", {
          params: {
            cartItemIds: this.$route.query.carItem,
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.loading = false;
            this.shopList = res.data.data;
          }
        });
    },
    // 支付方式
    Alipay(type) {
      this.$http
        .get("/api/v1/paySuccess", {
          params: {
            orderNo: this.ddh,
            payType: type,
          },
        })
        .then((res) => {
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.$toast.success("支付成功");
            this.$router.push("/MyShopList");
          }
        });
    },
    // 取消订单
    quxiao() {
      this.$toast.success("您已取消订单,请及时支付");
      this.$router.push("/MyShopList");
    },
    // 点击地址栏去地址列表里
    goAddressList() {
      this.$router.go(-1);
    },
  },
  // 计算总价
  computed: {
    total() {
      let num = 0;
      this.shopList.forEach((item) => {
        num += item.sellingPrice * item.goodsCount;
      });
      return num;
    },
  },
};
</script>

<style lang="less" scoped>
// 地址信息
.Address {
  height: 80px;
  font-size: 15px;
  .UserInfo {
    padding: 10px 10px;
    .namePhone {
      padding-bottom: 10px;
    }
  }
  .icon {
    position: absolute;
    right: 10px;
    top: 75px;
    font-size: 20px;
  }
}
.van-contact-card {
  padding: 16px;
}
&/deep/ .van-loading {
  padding-top: 300px;
}
.van-contact-card::before {
  position: absolute;
  top: 140px;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: -webkit-repeating-linear-gradient(
    135deg,
    #ff6c6c 0,
    #ff6c6c 20%,
    transparent 0,
    transparent 25%,
    #1989fa 0,
    #1989fa 45%,
    transparent 0,
    transparent 50%
  );
  background: repeating-linear-gradient(
    -45deg,
    #ff6c6c 0,
    #ff6c6c 20%,
    transparent 0,
    transparent 25%,
    #1989fa 0,
    #1989fa 45%,
    transparent 0,
    transparent 50%
  );
  background-size: 80px;
  content: "";
}
// 商品信息
.shopDeail {
  .shopinfo {
    padding: 10px 10px;
    display: flex;
    img {
      width: 120px;
      height: 100px;
    }
    .info {
      padding: 20px 5px;
      .top {
        font-size: 15px;
        display: flex;
        h3 {
          flex: 15;
        }
        .cur {
          flex: 1;
          padding-left: 45px;
        }
      }
      .bottom {
        padding-top: 20px;
        color: red;
      }
    }
  }
}
// 底部结账区
.statement {
  position: absolute;
  height: 100px;
  width: calc(100% - 40px);
  padding: 10px 20px;
  bottom: 0px;
  .money {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    h3 {
      font-size: 14px;
      color: #2c3e50;
    }
    p {
      color: red;
    }
  }
}
&/deep/ .van-button--default {
  background: #1baeae;
  border: 1px solid #1baeae;
}
&/deep/ .van-button--info {
  margin-bottom: 10px;
}
.content {
  padding: 16px 16px 160px;
}
</style>