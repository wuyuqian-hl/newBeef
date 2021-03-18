<template>
  <div>
    <!-- 搜索淘宝 -->
    <div class="navHeader">
      <img
        src="../../assets/hotGoodsesImg/gobackbtn.png"
        @click="toPage"
        alt=""
      />
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @clear="removeValue"
      />
      <button @click="searchCommodity">搜索</button>
    </div>
    <van-tabs type="card">
      <van-tab title="推荐"></van-tab>
      <van-tab title="新品"></van-tab>
      <van-tab title="价格"></van-tab>
    </van-tabs>
    <div class="searchName" v-height="85">
      <p class="noList" v-if="searchHave">没有更多了</p>
      <div v-if="showList">
        <div v-if="!searchHave" class="infoList">
          <div
            v-for="(item, index) in DetailList"
            :key="index"
            class="info"
            @click="PathTOdeil(item.goodsId)"
          >
            <img :src="prefix(item.goodsCoverImg)" alt="" />
            <div class="pric">
              <h3>{{ item.goodsName }}</h3>
              <p>{{ item.goodsIntro }}</p>
              <span>￥ {{ item.sellingPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import throttle from "../public/throttle";
export default {
  data() {
    return {
      active: 0,
      value: "", //请求的参数值
      DetailList: [], //存储搜索接口返回的数据
      searchHave: true,
      showList: false,
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
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
          this.$store.state.active = 1;
          this.$router.push("/SearchCommodity");
        }
      });
    },
    // 点击输入框的清除按钮
    removeValue() {
      this.showList = false;
      this.searchHave = true;
    },
    // 通过value来搜索接口
    searchCommodity: throttle(function () {
      this.$http
        .get("/api/v1/search", {
          params: {
            keyword: this.value,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.DetailList = res.data.data.list;
            // 如果有数据就让没有更多隐藏
            this.searchHave = false;
            this.showList = true;
          } else {
            this.searchHave = true;
          }
        });
    }, 1000),
    // 通过获取的id来跳转至详情页
    PathTOdeil(hid) {
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
    // 点击去往上一页
    toPage() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  background: #1baeae;
  border: 1px solid #1baeae;
}
&/deep/ .van-tabs__nav--card {
  border: 1px solid #1baeae;
}
&/deep/ .van-tab {
  color: #1baeae;
  border-right: 1px solid #1baeae;
}
&/deep/ .van-search {
  flex: 8;
  border-radius: 32px;
  border: 0px;
  background: #f7f7f7;
  padding-left: 15px;
  padding-right: 40px;
  height: 34px;
}
.navHeader {
  display: flex;
  padding: 10px 10px;
  .goback {
    display: inline-block;
    flex: 1;
  }
  .searchbtn {
    position: absolute;
    top: 20px;
    left: 15%;
  }
  button {
    width: 60px;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
    flex-wrap: nowrap;
    color: #fff;
    background: #1baeae;
    border-radius: 4px;
    border: 1px solid #1baeae;
  }
}
.searchName {
  width: 100%;
  .noList {
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
    color: rgb(129, 111, 111);
  }
}
.infoList {
  .info {
    display: flex;
    height: 150px;
    margin: 5px 0;
    img {
      flex: 1;
      width: 50px;
      height: 80%;
    }
    .pric {
      flex: 2;
      width: 100%;
      padding-left: 30px;
      h3 {
        width: 230px;
        font-size: 16px;
        padding: 10px 0;
        // 文字溢出隐藏...
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p {
        font-size: 14px;
        padding: 10px 0;
        color: #999999;
      }
      span {
        color: #1baeae;
      }
    }
  }
}
</style>