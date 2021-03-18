<template>
  <div class="container" v-height="50">
    <!-- 搜索淘宝 -->
    <div class="navHeader">
      <img src="../../assets/hotGoodsesImg/gobackbtn.png" alt="" />
      <input type="search" @click="changeVal" />
      <img
        v-if="changeValue"
        class="searchbtn"
        src="../../assets/hotGoodsesImg/search.png"
        alt=""
      />
      <p v-if="changeValue">全场50元起步</p>
    </div>
    <van-loading
      size="34px"
      v-height="155"
      vertical
      v-if="loading"
    ></van-loading>
    <!-- 导航栏 -->
    <div class="nav" v-height="155" v-if="!loading">
      <!-- 左侧导航 -->
      <div class="daohang">
        <ul v-for="(item, index) in classifyData" :key="index">
          <li :class="{ cur: activeColor == index }" @click="changeList(index)">
            {{ item.categoryName }}
          </li>
        </ul>
      </div>
      <!-- 右侧详情 -->
      <div class="xianqing" v-height="105">
        <div class="heidu">
          <!-- 如果接口的【0】有，就显示 -->
          <div>
            <div class="jiadian" v-if="ListData[0]">
              {{ ListData[this.activeColor][0].categoryName }}
            </div>
            <!-- 遍历list数组的内容 -->
            <div v-if="ListData[0]" class="listInfo">
              <div
                class="info"
                v-for="(item, index) in ListData[this.activeColor][0]
                  .thirdLevelCategoryVOS"
                :key="index"
                @click="toSearchPage"
              >
                <van-icon name="hot" size="30px" color="#00B1B1" />
                <p>{{ item.categoryName }}</p>
              </div>
            </div>
          </div>
          <!-- 如果接口的【1】有的话就显示，就显示这条 -->
          <div>
            <div v-if="ListData[1] && this.activeColor == 0" class="jiadian">
              {{ ListData[0][1].categoryName }}
            </div>
            <div v-if="ListData[1] && this.activeColor == 0" class="listInfo">
              <div
                class="info"
                v-for="(item, index) in ListData[0][1].thirdLevelCategoryVOS"
                :key="index"
                @click="toSearchPage"
              >
                <van-icon name="hot" size="30px" color="#00B1B1" />
                <p>{{ item.categoryName }}</p>
              </div>
            </div>
          </div>
          <!-- 如果接口的【2】有的话就显示，就显示这条 -->
          <div>
            <div class="jiadian" v-if="this.activeColor == 0 && ListData[2]">
              {{ ListData[0][2].categoryName }}
            </div>
            <div v-if="this.activeColor == 0 && ListData[2]" class="listInfo">
              <div
                class="info"
                v-for="(item, index) in ListData[0][2].thirdLevelCategoryVOS"
                :key="index"
                @click="toSearchPage"
              >
                <van-icon name="hot" size="30px" color="#00B1B1" />
                <p>{{ item.categoryName }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      changeValue: true, //是否搜索框的文字提示
      activeColor: 0, //文字变色
      type: 0,
      classifyData: [], //分类的总数据
      ListData: [], //列表的总数
      loading: false,
      active: 1,
    };
  },
  mounted() {
    this.classify();
  },
  methods: {
    changeVal() {
      // 当搜索框发生改变时搜索框的文字提示消失
      this.changeValue = false;
      this.$router.push("/SearchCommodity");
    },
    //获取分类页面的数据
    classify() {
      this.loading = true;
      this.$http.get("/api/v1/categories").then((res) => {
        if (res.status == 200 && res.data.message == "SUCCESS") {
          this.loading = false;
          this.classifyData = res.data.data;
          this.classifyData.forEach((item) => {
            this.ListData.push(item.secondLevelCategoryVOS);
          });
        }
      });
    },
    // 给列表的点击事件
    changeList(num) {
      // 当列表点击时文字发生样式变化
      this.activeColor = num;
    },
    // 点击跳转至搜索页面
    toSearchPage() {
      this.$router.push("/SearchCommodity");
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  padding-top: 300px;
}
.container {
  width: 100%;
  height: 100%;
}
// 导航头搜索框
.navHeader {
  display: flex;
  padding: 10px 10px;
  border-bottom: 1px solid #c3c3c3;
  .goback {
    display: inline-block;
    flex: 1;
  }
  input {
    flex: 8;
    border-radius: 32px;
    border: 0px;
    background: #f7f7f7;
    padding-left: 15px;
    margin-right: 40px;
    height: 34px;
  }
  .searchbtn {
    position: absolute;
    top: 20px;
    left: 15%;
  }
  P {
    position: absolute;
    top: 20px;
    left: 22%;
    color: #666666;
    font-size: 12px;
  }
}
// 导航部分
.nav {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  // 左侧导航
  .daohang {
    flex: 30%;
    li {
      margin: 18px 6px;
      font-size: 12px;
      &.cur {
        color: #00b1b1;
      }
    }
  }
  // 右侧详情
  .xianqing {
    flex: 70%;
    height: 100%;
    overflow: auto;

    .jiadian {
      padding: 30px 0;
      font-size: 16px;
      color: #253f50;
    }
    .listInfo {
      display: flex;
      flex-wrap: wrap;
      margin: 10px 10px;
      font-size: 12px;
      color: #253f50;
      .info {
        flex: 33%;
        p {
          padding: 10px 0;
        }
      }
    }
  }
}
</style>