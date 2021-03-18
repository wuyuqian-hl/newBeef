<template>
  <div class="container" v-height="50">
    <!-- 导航头 -->
    <sHeader :name="'购物车'"></sHeader>
    <!-- 没有购物详情的列表-->
    <div class="Noshop" v-height="37" v-if="shopList.length == 0">
      <div class="yangshi" v-height="287">
        <van-icon name="smile-o" size="40px" />
        <p>购物车空空空如也</p>
        <button @click="goHome">前往首页</button>
      </div>
    </div>
    <!-- 有购物车的列表 -->
    <div v-else class="haveShop" v-height="80" :right-width="50">
      <van-loading
        size="34px"
        v-height="155"
        vertical
        v-if="loading"
      ></van-loading>
      <div v-for="(item, index) in shopList" :key="index" v-if="!loading">
        <van-checkbox-group
          @change="changevalue"
          v-model="result"
          ref="checkboxGroup"
          checked-color="#1BAEAE"
        >
          <div class="card">
            <van-swipe-cell>
              <div class="cardinfo">
                <!-- 选中状态 -->
                <div class="check">
                  <van-checkbox
                    bind-group
                    :name="item.cartItemId"
                  ></van-checkbox>
                </div>
                <!-- 卡片信息 -->
                <img
                  :src="prefix(item.goodsCoverImg)"
                  alt=""
                  @click="toDetail(item.goodsId)"
                />
                <div class="info">
                  <div class="top" @click="toDetail(item.goodsId)">
                    <span>{{ item.goodsName }}</span>
                    <span class="cur">X{{ item.goodsCount }}</span>
                  </div>
                  <div class="bottom">
                    <span @click="toDetail(item.goodsId)"
                      >￥{{ item.sellingPrice }}</span
                    >
                    <div>
                      <van-stepper
                        integer
                        min="1"
                        :value="item.goodsCount"
                        @change="onChange"
                        :name="item.cartItemId"
                        async-change
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 删除按钮 -->
              <template #right>
                <van-button
                  square
                  type="danger"
                  @click="deleteShop(item.cartItemId)"
                  icon="delete-o"
              /></template>
              <!-- <van-button square slot="right" type="danger" icon="delete-o"></van-button> -->
            </van-swipe-cell>
          </div>
        </van-checkbox-group>
        <van-submit-bar
          button-type="primary"
          button-color="#1BAEAE"
          :price="total * 100"
          button-text="提交订单"
          @submit="onSubmit"
        >
          <van-checkbox
            @click="checkAll"
            v-model="checked"
            checked-color="#1BAEAE"
            >全选</van-checkbox
          >
        </van-submit-bar>
      </div>
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
      shopList: [], // 存储加购的数据
      noshop: true, // 当购物车没有数据时
      checked: false, //是否选中
      result: [],
      value: "",
      loading: false,
      active: 2,
    };
  },
  created() {
    // 判断用户是否登录
    this.getuserList();
    // 获取已在购物车的商品信息
    this.getShopList();
  },
  methods: {
    // 当没有商品时点击返回首页按钮返回首页
    goHome() {
      this.$store.state.active = 0;
      this.$router.push("/HomePage");
    },
    // 判断用户是否登录
    getuserList() {
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
          this.$router.push("/ShoppingTrolley");
        }
      });
    },
    // 获取用户加购的商品
    getShopList() {
      this.loading = true;
      this.$http.get("/api/v1/shop-cart").then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          this.$store.state.active = 2;
          this.loading = false;
          this.shopList = res.data.data;
          this.noshop = false;
        }
      });
    },
    // 点击商品去详情
    toDetail(hid) {
      this.$http.get("/api/v1/goods/detail/" + hid).then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          let obj = {
            path: "/ShopDetail",
            query: {
              id: hid,
            },
          };
          this.$router.push(obj);
        }
      });
    },
    // 当复选框发生变化时
    changevalue(val) {
      if (val.length == this.shopList.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.result = val;
    },
    // 是否全选
    checkAll() {
      if (this.checked) {
        this.result = this.shopList.map((item) => item.cartItemId);
      } else {
        this.result = [];
      }
    },
    // 当数量发生改变时，修改接口数据
    onChange(detail, id) {
      this.$http
        .put("/api/v1/shop-cart", {
          cartItemId: id.name,
          goodsCount: detail,
        })
        .then((res) => {
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
          });
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.$toast("修改成功");
          }
        });
      //实时更新数量的方法
      //遍历数组，如果数组的id等于传进来的id,就让数组的数量等于传进来的数量
      this.shopList.forEach((item) => {
        if (item.cartItemId == id.name) {
          item.goodsCount = detail;
        }
      });
    },
    // 删除购物车商品
    deleteShop(id) {
      this.$http.delete("/api/v1/shop-cart/" + id).then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          this.$toast.success("删除成功");
          console.log(res);
        }
        this.shopList.forEach((item) => {
          if (item.cartItemId == id) {
            this.shopList = this.getShopList();
          }
        });
      });
    },
    // 点击提交订单
    onSubmit() {
      // 如果没有选择商品就提交订单，打回原形
      if (this.result.length == 0) {
        this.$toast.fail("请选择商品进行结账");
        return;
      }
      // 将提交订单所需要的id与地址转换为字符串
      const params = JSON.stringify(this.result);
      // 将id传过去订单页面
      let obj = {
        path: "/SubmitOrder",
        query: {
          cartItemIds: params,
          carItem: this.result,
        },
      };
      this.$router.push(obj);
      // this.$http.post('/api/v1/saveOrder',{
      // "addressId": id,
      // "cartItemIds": [
      //   this.result
      // ]
      // })
    },
  },
  // 计算总价
  computed: {
    total() {
      let num = 0;
      let list = this.shopList.filter((item) =>
        this.result.includes(item.cartItemId)
      );
      list.forEach((item) => (num += item.sellingPrice * item.goodsCount));
      return num;
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  padding-top: 300px;
}
&/deep/ .van-submit-bar {
  margin-bottom: 50px;
}
&/deep/ .van-swipe-cell {
  width: 100%;
}
.container {
  width: 100%;
  height: 100%;
  // 购物车空的的样式
  .Noshop {
    width: 100%;
    text-align: center;
    height: 100%;
    overflow: auto;
    .yangshi {
      height: 100%;
      padding-top: 200px;
      p {
        color: #253f50;
        font-size: 14px;
        padding-bottom: 10px;
      }
      button {
        width: 150px;
        height: 35px;
        background: #00b1b1;
        color: #fff;
        border: 1px solid #00b1b1;
      }
    }
  }
  // 有购物车的样式
  .card {
    display: flex;
    .check {
      margin: auto 5px;
    }
    .delete {
      width: 50px;
      padding: 5px 0;
    }
    .cardinfo {
      display: flex;
      width: 100%;
      margin-top: 10px;
      img {
        flex: 1;
        width: 100px;
        height: 100%;
      }
      .info {
        flex: 8;
        padding: 20px 20px;
        width: 100%;
        .top {
          width: 100%;
          display: flex;
          height: 30px;
          span {
            flex: 9;
            font-size: 12px;
            color: rgb(94, 87, 87);
          }
          .cur {
            flex: 1;
          }
        }
        .bottom {
          width: 100%;
          height: 40px;
          padding-top: 10px;
          span {
            color: red;
            float: left;
          }
          div {
            float: right;
            input {
              width: 20px;
            }
          }
        }
      }
    }
  }
  .haveShop {
    overflow: auto;
  }
}
&/deep/ .van-button--danger {
  width: 50px;
  height: 100%;
}
</style>