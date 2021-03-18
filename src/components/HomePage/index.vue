<template>
  <div class="container">
    <!-- 导航头 -->
    <div class="swipe">
      <!-- 搜索区域 -->
      <div class="navHeader">
        <van-nav-bar title="标题" left-arrow>
          <template #left>
            <van-icon name="wap-nav" size="18" color="#00B1B1" />
          </template>
          <template #title>
            <div class="search" @click="changeValue" v-if="changevalue">
              <p>新蜂商城</p>
              <b>|</b><span>山河无恙，人间皆安</span>
            </div>
            <input
              type="search"
              autofocus="autofocus"
              class="newsearch"
              v-if="!changevalue"
            />
          </template>
          <template #right class="login">
            <div @click="login" v-if="!show">登录</div>
            <div>
              <van-icon
                name="manager"
                size="24px"
                color="#00b1b1"
                @click="userPage"
                v-if="show"
              />
            </div>
          </template>
        </van-nav-bar>
      </div>
      <!-- 轮播图 -->
      <div class="swipes">
        <van-loading type="spinner" size="34" vertical v-if="loading" />
        <van-swipe :autoplay="3000" v-if="!loading">
          <van-swipe-item
            v-if="SwipeImg"
            v-for="(image, index) in SwipeImg"
            :key="index"
          >
            <img :src="image" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <!-- 热门商品 -->
    <div class="navigation">
      <ul class="hot">
        <li>
          <img src="../../assets/hotGoodsesImg/shopping.png" alt="" />
          <p>新蜂超市</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/newcostume.png" alt="" />
          <p>新蜂服饰</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/quanqiu.png" alt="" />
          <p>全球购</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/fresh.png" alt="" />
          <p>新蜂生鲜</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/gohome.png" alt="" />
          <p>新蜂到家</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/topUp.png" alt="" />
          <p>充值缴费</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/nianshop.png" alt="" />
          <p>9.9元拼</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/getCoupon.png" alt="" />
          <p>领劵</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/saveMoney.png" alt="" />
          <p>省钱</p>
        </li>
        <li>
          <img src="../../assets/hotGoodsesImg/All.png" alt="" />
          <p>全部</p>
        </li>
      </ul>
    </div>
    <!-- 新品上线 -->
    <div class="NewArrival">新品上线</div>
    <!-- 新品上线内容 -->
    <ul class="NewPhone">
      <van-loading type="spinner" size="34" v-if="loading" />
      <li
        v-for="(item, index) in hotGoodses"
        :key="index"
        @click="changeDetail(item.goodsId)"
      >
        <img :src="prefix(item.goodsCoverImg)" alt="" />
        <div class="Phoneinfo">
          <p class="phonename">{{ item.goodsName }}</p>
          <p class="phonexixi">{{ item.goodsIntro }}</p>
          <span>￥{{ item.sellingPrice }}</span>
        </div>
      </li>
    </ul>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 热门商品 -->
      <div class="NewArrival">热门商品</div>
      <!-- 热门商品内容 -->
      <ul class="hotCommodity">
        <van-loading type="spinner" size="34" v-if="loading" />
        <li
          v-for="(item, index) in newGoodses"
          :key="index"
          @click="changeDetail(item.goodsId)"
        >
          <img :src="prefix(item.goodsCoverImg)" alt="" />
          <div class="Phoneinfo">
            <p class="phonename">{{ item.goodsName }}</p>
            <p class="phonexixi">{{ item.goodsIntro }}</p>
            <span>￥{{ item.sellingPrice }}</span>
          </div>
        </li>
      </ul>
      <!-- 推荐商品 -->
      <div class="NewArrival">推荐商品</div>
      <!-- 推荐商品内容 -->
      <ul class="ReccCommodity">
        <van-loading type="spinner" size="34" v-if="loading" />
        <li
          v-for="(item, index) in recommendGoodses"
          :key="index"
          @click="changeDetail(item.goodsId)"
        >
          <img :src="prefix(item.goodsCoverImg)" alt="" />
          <div class="Phoneinfo">
            <p class="phonename">{{ item.goodsName }}</p>
            <p class="phonexixi">{{ item.goodsIntro }}</p>
            <span>￥{{ item.sellingPrice }}</span>
          </div>
        </li>
      </ul>
    </van-list>
    <Navbar></Navbar>
  </div>
</template>

<script>
import Navbar from "../index";
export default {
  components: {
    Navbar,
  },

  data() {
    return {
      changevalue: true, //搜索框是否显示初始样式
      Homedata: {}, //首页的总数据
      Swipe: [], //轮播图素材
      SwipeImg: [], //轮播图图片
      hotGoodses: [], //新品上线
      newGoodses: [], //热门商品
      recommendGoodses: [], // 推荐商品
      DetailData: [], // 详情数据
      show: false,
      loadng: false,
      active: 0,
      list: [],
      loading: false,
      finished: false,
    };
  },
  // 初始化时请求首页接口数据
  created() {
    // this.getHomeinfo();
    this.onLoad();
    this.getuserList();
    // window.location.reload();
  },
  methods: {
    changeValue() {
      this.changevalue = false;
    },
    // 判断用户是否登录
    getuserList() {
      // 获取用户是否登录状态，如果不是，跳到登录页面，如果就，就直接到购物车页面
      this.$http.get("/api/v1/user/info").then((res) => {
        if (res.data.message == "未登录！") {
          this.show = false;
        } else if (res.data.message == "无效认证！请重新登录！") {
          this.$toast.fail("请重新登录");
        } else if (
          res.data.message == "SUCCESS" &&
          res.data.resultCode == 200
        ) {
          this.show = true;
        }
      });
    },
    // 获取首页数据
    onLoad() {
      this.loadng = true;
      this.loading = true;
      this.$http
        .get("api/v1/index-infos", {
          headers: { token: window.localStorage.token },
        })
        .then((res) => {
          if (res.status == 200 && res.data.message == "SUCCESS") {
            this.loading = false;
            // 总数据
            this.Homedata = res.data.data;
            // 请求轮播图素材
            this.Swipe = this.Homedata.carousels;
            //遍历轮播图然后push进数组里
            this.Swipe.forEach((item) => {
              if (item) {
                this.SwipeImg.push(item.carouselUrl);
              }
            });
            //请求新品上线的图片以及信息

            this.hotGoodses = this.Homedata.hotGoodses;
            //请求热门商品的图片以及信息
            this.newGoodses = this.Homedata.newGoodses;
            //请求推荐商品的图片以及信息
            this.recommendGoodses = this.Homedata.recommendGoodses;
            // this.url = "http://47.99.134.126:28019"+this.Homedata.
          }
        });
      this.loading = false;
      if (this.hotGoodses.length >= 4) {
        this.finished = true;
      }
      if (this.newGoodses.length >= 5) {
        this.finished = true;
      }
      if (this.recommendGoodses.length >= 10) {
        this.finished = true;
      }
    },
    // 获取详情数据
    changeDetail(id) {
      let obj = {
        path: "/ShopDetail",
        query: {
          hotGoodses: this.hotGoodses,
          id: id,
        },
      };
      this.$http.get("/api/v1/goods/detail/" + id).then((res) => {
        if (res.status == 200) {
          this.DetailData = res.data;
        }
      });
      this.$router.push(obj);
    },
    // 登录页面
    login() {
      this.$router.push("/Login");
    },
    // 用户页面
    userPage() {
      this.$store.state.active = 3;
      this.$router.push("/MySet");
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  width: 100%;
  height: 100%;
  padding-top: 100px;
  text-align: center;
}
&/deep/ .van-ellipsis {
  width: 100%;
  max-width: 100%;
}
&/deep/ .van-nav-bar {
  background: transparent;
  .van-nav-bar__right {
    color: #00b1b1;
  }
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  // 轮播图与搜索框
  .swipes {
    width: 100%;
    height: 172px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &/deep/ .van-swipe {
    width: 100%;
    height: 100%;
  }
  .swipe {
    width: 100%;
    height: 100%;

    .navHeader {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      background: transparent;
    }
    // 搜索框样式
    .search {
      display: flex;
      border-radius: 32px;
      background-color: rgba(252, 243, 243, 0.4);
      border: 1px solid #ccc;
      max-width: 70%;
      margin: 0 auto;
      p {
        color: #11c3c2;
        font-size: 18px;
        line-height: 28px;
        font-family: 方正粗黑宋简体;
        padding: 0 8px;
      }
      b {
        color: #c6c6c6;
        line-height: 28px;
        margin-left: 4px;
      }
      span {
        color: #666666;
        padding: 4px 0px;
        padding-left: 4px;
        font-size: 14px;
      }
    }
    // 搜索框样式
    .newsearch {
      border-radius: 32px;
      background-color: #fff;
      border: 1px solid #ccc;
      width: 70%;
      padding: 4px 8px;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  // 热门商品样式
  .navigation {
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    .hot {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        flex: 20%;
        text-align: center;
        margin-top: 5px;
        p {
          font-size: 12px;
          color: #253f50;
        }
      }
    }
  }
  // 新品上线
  .NewArrival {
    width: 100%;
    background: #f9f9f9;
    font-size: 14px;
    color: #00b1b1;
    padding: 16px 0;
    text-align: center;
  }
  // 新品上线的内容
  .NewPhone {
    display: flex;
    flex-wrap: wrap;
    height: 324px;
    li {
      position: relative;
      width: 100%;
      top: 0;
      flex: calc(50% - 3px);
      text-align: center;
      border-right: 1px solid #f3f3f3;
      border-bottom: 1px solid #f3f3f3;
      font-size: 12px;
      margin-top: 10px;
      img {
        position: relative;
        top: 0;
        width: 100px;
        height: 90px;
      }
      .Phoneinfo {
        position: absolute;
        bottom: 5px;
        width: 100%;
        .phonename {
          padding-left: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .phonexixi {
          width: 80%;
          padding-left: 30px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        span {
          color: #00b1b1;
        }
      }
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .phonename {
        width: 100%;
      }
    }
  }
  // 热门商品的内容
  .hotCommodity {
    display: flex;
    flex-wrap: wrap;
    height: 322px;
    li {
      position: relative;
      top: 0;
      width: 100%;
      flex: 33%;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 10px;
      white-space: nowrap;
      text-align: center;
      img {
        position: relative;
        top: 0;
        width: 100%;
        width: 100px;
        height: 100px;
      }
      .Phoneinfo {
        position: absolute;
        bottom: 5px;
        width: 100%;
        .phonename {
          padding-left: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .phonexixi {
          width: 80%;
          padding-left: 30px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        span {
          color: #00b1b1;
        }
      }
    }
  }
  // 推荐商品内容
  .ReccCommodity {
    display: flex;
    flex-wrap: wrap;
    height: 197px;
    li {
      position: relative;
      top: 0;
      width: 100%;
      flex: 20%;
      font-size: 12px;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 10px;
      white-space: nowrap;
      text-align: center;
      img {
        position: relative;
        top: 0;
        width: 100%;
        width: 50%;
        height: 40%;
      }
      .Phoneinfo {
        position: absolute;
        bottom: 0;
        width: 100%;
        .phonename {
          padding-left: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .phonexixi {
          width: 80%;
          padding-left: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        span {
          color: #00b1b1;
        }
      }
    }
  }
  .zhedie {
    width: 100%;
    height: 50px;
    background: #fff;
  }
}
</style>