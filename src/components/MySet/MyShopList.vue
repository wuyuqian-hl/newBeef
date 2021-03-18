<template>
  <div>
    <sHeader :name="'我的订单'"></sHeader>
    <van-tabs
      line-width="50px"
      line-width-color="#1baeae"
      @change="changePath"
      v-model="status"
    >
      <van-tab name="" title="全部"></van-tab>
      <van-tab name="0" title="代付款"> </van-tab>
      <van-tab name="1" title="待确认"></van-tab>
      <van-tab name="2" title="待收货"></van-tab>
      <van-tab name="3" title="已发货"></van-tab>
      <van-tab name="4" title="交易完成"></van-tab>
    </van-tabs>
    <van-loading size="34px" v-height="155" vertical v-if="loading"></van-loading>
    <div v-if="!loading">
      <div
        v-for="(item, index) in AllData"
        :key="index"
        v-if="AllData.length !== 0"
      >
        <div class="zhifu">
          <p>订单时间：{{ item.createTime }}</p>
          <span>{{ item.orderStatusString }}</span>
        </div>
        <van-card
          :num="item.newBeeMallOrderItemVOS[0].goodsCount"
          :price="item.newBeeMallOrderItemVOS[0].sellingPrice"
          :title="item.newBeeMallOrderItemVOS[0].goodsName"
          @click="OrderDetails(item.orderNo)"
          desc="全场包邮"
          :thumb="prefix(item.newBeeMallOrderItemVOS[0].goodsCoverImg)"
        />
      </div>
      <div class="noShopList" v-if="AllData.length == 0">没有更多了...</div>
    </div>
    <footer>
      <van-pagination
        v-model="currentPage"
        :total-items="PageData.totalCount"
        :page-count="PageData.totalPage"
        @change="changePath"
        force-ellipses
      />
    </footer>
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
      AllData: [], //总数
      status: "",
      PageData: [],
      currentPage: 1,
      loading:false,
    };
  },
  created() {
    this.changePath();
  },
  methods: {
    // 请求订单数据
    changePath(num) {
      // qs的作用是将参数里的数组去掉
      this.loading = true;
      const qs = require("qs");
      this.$http
        .get("/api/v1/order", {
          params: {
            pageNumber: num,
            status: this.status,
          },
          paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        })
        .then((res) => {
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.loading = false;
            this.AllData = res.data.data.list;
            this.PageData = res.data.data;
            this.currentPage = this.PageData.currPage;
          }
        });
    },
    // 点击查看订单详情
    OrderDetails(val) {
      let obj = {
        path: "/OrderDetails",
        query: {
          orderNumber: val,
        },
      };
      this.$router.push(obj);
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading{
  padding-top: 300px;
}
&/deep/ .van-tab--active {
  color: #1baeae;
}
&/deep/ .van-tabs__line {
  background: #1baeae;
}
.zhifu {
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 20px;
  display: flex;
  color: #696561;
  justify-content: space-between;
  font-size: 13px;
}
footer {
  position: fixed;
  width: 100%;
  bottom: 0;
}
.noShopList {
  text-align: center;
  font-size: 14px;
  padding-top: 20px;
  color: rgb(83, 75, 75);
}
</style>