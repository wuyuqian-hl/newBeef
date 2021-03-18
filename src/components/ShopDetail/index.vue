<template>
  <div>
    <div class="Delitlheader">
      <img
        src="../../assets/hotGoodsesImg/gobackbtn.png"
        alt=""
        @click="changePath"
      />
      <p>商品详情</p>
      <span>...</span>
    </div>
    <van-loading
      size="34px"
      v-height="50"
      vertical
      v-if="loading"
    ></van-loading>
    <!-- 商品详情 -->
    <div v-height="37" class="delitel" v-if="!loading">
      <div class="slidePic">
        <img :src="prefix(DetailData.goodsCoverImg)" alt="" />
      </div>
      <div class="info">
        <div class="phoneName">
          {{ DetailData.goodsName }}<span>{{ DetailData.goodsIntro }}</span>
        </div>
        <p>免邮费 顺丰快递</p>
        <span class="nowPrice">￥{{ DetailData.sellingPrice }}</span
        ><s class="oldPrice">{{ DetailData.originalPrice }}</s>
      </div>
      <ul>
        <li class="cur">概述</li>
        <li class="cur">参数</li>
        <li class="cur">安装服务</li>
        <li>常见问题</li>
      </ul>
      <!-- 详情照片 -->
      <div class="delPic">
        <img
          src="https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/huawei-1.jpg"
          alt=""
        />
        <img
          src="https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/huawei-3.jpg"
          alt=""
        />
      </div>
    </div>
    <!-- 加入购物车 -->
    <div>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" />
        <van-goods-action-icon
          v-if="show"
          icon="cart-o"
          text="购物车"
          @click="goshopping"
        />
        <van-goods-action-icon
          v-if="yingchang"
          icon="cart-o"
          @click="goshopping"
          :badge="active"
          text="购物车"
        />
        <van-goods-action-button
          color="linear-gradient(to right, #69D7D7 , #098989)"
          type="warning"
          @click="addCommodity"
          text="加入购物车"
        />
        <van-goods-action-button
          color="linear-gradient(to right, #69D7D7 , #098989)"
          type="danger"
          text="立即购买"
          @click="gotoShop"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import debounce from "../public/debounce";
export default {
  data() {
    return {
      DetailData: [], //详情页数据
      id: [], //通过id来获取信息
      active: this.$store.state.count, // 加入购物车变数量
      show: true,
      yingchang: false,
      loading: false,
      reult: [],
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getList();
  },
  methods: {
    // 判断用户是否登录
    getList() {
      this.loading = true;
      this.$http.get("/api/v1/goods/detail/" + this.id).then((res) => {
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
          this.loading = false;
          this.$router.push("/ShopDetail");
          this.DetailData = res.data.data;
        }
      });
    },
    // 点击返回键至前一页
    changePath() {
      this.$router.go(-2);
    },
    // 加入购物车
    addCommodity: debounce(function () {
      this.$http
        .post("/api/v1/shop-cart", {
          goodsCount: this.active,
          goodsId: this.id,
        })
        .then((res) => {
          if (res.data.resultCode == 200) {
            // 空购物车隐藏
            this.show = false;
            // 带图标的购物车显示
            this.yingchang = true;
            // 图标数量+1
            this.active += 0;
            this.$store.state.active = 2;
            // 提示
            this.$toast.success("加入成功");
          } else if (res.data.message == "已存在！无需重复添加！") {
            // 空购物车隐藏
            this.show = false;
            // 带图标的购物车显示
            this.yingchang = true;
            // 图标数量为1
            this.active = 1;
            // 提示
            this.$toast.fail("已加入，无需重复提交");
          }
        });
    }, 500),
    //点击购物车去购物车
    goshopping() {
      this.$store.state.active = 2;
      this.$router.push("/ShoppingTrolley");
    },
    // 请前往购物车购买
    gotoShop() {
      this.$toast({
        message: "请加入购物车前往购物车购买",
        position: "bottom",
        duration: 3000,
      });
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  padding-top: 300px;
}
// 详情头部
.Delitlheader {
  height: 35px;
  border: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  p {
    font-size: 12px;
    line-height: 35px;
  }
  span {
    font-weight: 790;
    line-height: 25px;
    margin-right: 10px;
  }
  img {
    height: 100%;
  }
}
// 详情信息
.delitel {
  height: 100%;
  overflow: auto;
  padding-left: 5px;
  .info {
    .phoneName {
      font-size: 20px;
      span {
        padding-left: 10px;
        font-size: 12px;
        color: rgb(148, 138, 138);
      }
    }
    p {
      font-size: 15px;
      color: rgb(117, 105, 105);
      margin-top: 5px;
    }
    .nowPrice {
      color: #f63515;
      margin: 10px 0px;
      font-size: 22px;
    }
    s {
      color: rgb(119, 110, 110);
      padding-left: 10px;
    }
  }
  ul {
    display: flex;
    text-align: center;
    padding-top: 10px;
    li {
      flex: 1;
      padding: 5px 0;
      color: #2c3e50;
    }
    .cur {
      border-right: 1px solid #999999;
    }
  }
  .delPic {
    width: 100%;
    margin-top: 10px;
    img {
      width: 100%;
    }
  }
}
</style>