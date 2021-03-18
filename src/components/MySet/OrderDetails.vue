<template>
  <div class="container">
    <sHeader :name="'订单详情'"></sHeader>
    <van-loading
      size="34px"
      v-height="155"
      vertical
      v-if="loading"
    ></van-loading>
    <div v-if="!loading">
      <!-- 订单详情 -->
      <div class="xq">
        <div class="state">
          <div class="shopstate">
            <h3>
              订单状态：<span
                v-if="
                  StateData.orderStatusString !== '待支付' &&
                  StateData.orderStatusString !== '已支付'
                "
                >手动取消</span
              >
              <span
                v-if="
                  StateData.orderStatusString == '待支付' ||
                  StateData.orderStatusString == '已支付'
                "
                >{{ StateData.orderStatusString }}</span
              >
            </h3>
            <h3>
              订单编号：<span>{{ StateData.orderNo }}</span>
            </h3>
            <h3>
              下单时间：<span>{{ StateData.createTime }}</span>
            </h3>
          </div>
          <!-- 支付按钮 -->
          <van-button
            type="primary"
            v-if="StateData.orderStatusString == '待支付'"
            @click="payment"
            block
            >去支付</van-button
          >
          <!-- 支付方式 -->
          <van-action-sheet
            v-if="StateData.orderStatusString == '待支付'"
            v-model="show"
            title="请选择支付方式"
          >
            <div class="content">
              <van-button type="info" block @click="Alipay(1)"
                >支付宝支付</van-button
              >
              <van-button type="primary" block @click="Alipay(2)"
                >微信支付</van-button
              >
            </div>
          </van-action-sheet>
          <!--  -->
          <van-button
            v-if="
              StateData.orderStatusString == '待支付' ||
              StateData.orderStatusString == '已支付'
            "
            block
            @click="cancellation"
            >取消订单</van-button
          >
          <p></p>
        </div>
      </div>
      <!-- 配送方式 -->
      <div class="distribution">
        <h3>
          商品金额：<span>￥{{ StateData.totalPrice }}</span>
        </h3>
        <h3>配送方式：<span>普通配送</span></h3>
      </div>
      <!-- 商品卡片 -->
      <div
        class="card"
        v-for="one in StateData.newBeeMallOrderItemVOS"
        v-if="StateData.newBeeMallOrderItemVOS"
      >
        <van-card
          :num="one.goodsCount"
          :price="one.sellingPrice"
          desc="全场包邮"
          :title="one.goodsName"
          :thumb="prefix(one.goodsCoverImg)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import sHeader from "../public/navHeader";
export default {
  components: {
    sHeader,
  },
  data() {
    return {
      StateData: [], //总数据
      show: false,
      loading: false,
    };
  },
  created() {
    this.getOrerDetail();
  },
  methods: {
    // 获取商品详情信息
    getOrerDetail() {
      (this.loading = true),
        this.$http
          .get("/api/v1/order/" + this.$route.query.orderNumber)
          .then((res) => {
            if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
              this.loading = false;
              this.StateData = res.data.data;
            }
            console.log(res);
          });
    },
    // 取消订单
    cancellation() {
      Dialog.confirm({
        title: "确认取消订单？",
      })
        .then(() => {
          this.$http
            .put("/api/v1/order/" + this.$route.query.orderNumber + "/cancel")
            .then((res) => {
              if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
                this.$toast.success("已成功取消订单");
                this.StateData.orderStatusString = "手动取消";
              }
              console.log(res);
            });
        })
        .catch(() => {});
    },
    // 支付订单
    payment() {
      this.show = true;
    },
    // 支付方式
    Alipay(type) {
      this.$http
        .get("/api/v1/paySuccess", {
          params: {
            orderNo: this.$route.query.orderNumber,
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
  },
};
</script>

<style lang="less" scoped>
.container {
  background: #f7f7f7;
  width: 100%;
  height: 100%;
}
.xq {
  width: 100%;
  background: #fff;
  // height: 218px;
  .state {
    margin: 20px 20px;
    .shopstate {
      h3 {
        width: 100%;
        color: #b2b3b3;
        padding-bottom: 15px;
        span {
          color: rgb(110, 99, 99);
        }
      }
    }
    p {
      height: 10px;
    }
  }
}
.distribution {
  height: 100px;
  padding: 25px 20px;
  background: #fff;
  h3 {
    width: 100%;
    color: #b2b3b3;
    padding-bottom: 15px;
    span {
      color: rgb(110, 99, 99);
    }
  }
}
.card {
  margin-top: 20px;
}
// 显示遮罩
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 95%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
&/deep/ .van-card {
  background: #fff;
}
&/deep/ .van-button {
  margin-bottom: 10px;
}
&/deep/ .van-button--primary {
  margin-bottom: 10px;
  background: #00b2b2;
  border: 1px solid #00b2b2;
}
&/deep/ .van-loading {
  padding-top: 300px;
}
.content {
  padding: 16px 16px 160px;
}
</style>