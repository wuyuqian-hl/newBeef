<template>
  <div class="container">
    <!-- 导航头 -->
    <div class="swipe">
      <!-- 搜索区域 -->
      <div class="navHeader">
        <van-nav-bar title="标题" left-arrow>
          <template #left>
            <van-icon name="wap-nav" size="18" />
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
          <template #right> 登录 </template>
        </van-nav-bar>
      </div>
      <!-- 轮播图 -->
      <div class="swipe">
        <van-swipe :autoplay="3000">
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
      <li v-for="(item, index) in hotGoodses" :key="index">
        <img src="../../assets/hotGoodsesImg/phone.png" alt="" />
        <div class="Phoneinfo">
          <p class="phonename">{{ item.goodsName }}</p>
          <p>{{ item.goodsIntro }}</p>
          <span>{{ item.sellingPrice }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changevalue: true, //搜索框是否显示初始样式
      Homedata: {}, //首页的总数据
      Swipe: [], //轮播图素材
      SwipeImg: [], //轮播图图片
      hotGoodses: [], //新品上线
    };
  },
  // 初始化时请求首页接口数据
  created() {
    this.getHomeinfo();
  },
  methods: {
    changeValue() {
      this.changevalue = false;
    },
    getHomeinfo() {
      this.$http.get("api/v1/index-infos").then((res) => {
        if (res.status == 200 && res.data.message == "SUCCESS") {
          // 总数据
          this.Homedata = res.data.data;
          console.log(this.Homedata);
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
        }
      });
    },
    // getUrl(){

    // }
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-ellipsis {
  width: 100%;
  max-width: 100%;
}
&/deep/ .van-nav-bar {
  background: transparent;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  // 轮播图与搜索框
  .swipe {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
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
    li {
      flex: calc(50% - 3px);
      text-align: center;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      font-size: 12px;
      white-space:nowrap;
      text-overflow:ellipsis;
      overflow: hidden;
      .phonename{
        width: 100%;
      }
    }
  }
}
</style>