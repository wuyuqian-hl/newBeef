<template>
  <div>
    <!-- 地址头 -->
    <sHeader :name="'地址管理'"></sHeader>
    <van-loading
      size="34px"
      v-height="155"
      vertical
      v-if="loading"
    ></van-loading>
    <van-address-list
      v-if="!loading"
      @select="submitOrderForm"
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="addSite"
      @edit="onEdit(AddressList)"
    />
    <!-- <van-address-list
      default-tag-text="默认"
      @add="addSite"
    /> -->
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
      chosenAddressId: "1",
      AddressList: [], //存储所有地址数据
      disabledList: [],
      list: [],
      loading: false,
    };
  },
  created() {
    this.getAddressList();
  },
  methods: {
    // 获取已有的地址
    getAddressList() {
      this.loading = true;
      this.$http.get("/api/v1/address").then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          this.loading = false;
          this.AddressList = res.data.data;
          this.list = this.AddressList.map((item) => {
            return {
              id: item.addressId,
              name: item.userName,
              tel: item.userPhone,
              address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
              isDefault: item.defaultFlag ? 1 : 0,
            };
          });
        }
      });
    },
    // 新增地址
    addSite() {
      this.$store.state.NewArred = true;
      this.$router.push("/addSite");
    },
    // 编辑地址
    onEdit(user) {
      this.$store.state.NewArred = false;
      let obj = {
        path: "/addSite",
        query: {
          AddList: {
            user: user,
            id: user.id,
            name: user.name,
            tel: user.tel,
            province: user.address,
            city: user.address,
            county: user.address,
            addressDetail: user.address,
            userId: this.AddressList[0].userId,
            isDefault: !!user.isDefault,
          },
        },
      };
      this.$router.push(obj);
    },
    // 生成订单
    submitOrderForm(user) {
      // 将json的字符串转换为数组
      let params = eval("(" + this.$route.query.cartItemIds + ")");
      let obj = {
        path: "/OrderForm",
        query: {
          //地址信息
          addressId: user.id,
          cartItemIds: params,
          address: user.address,
          name: user.name,
          tel: user.tel,
          carItem: this.$route.query.carItem,
        },
      };
      this.$router.push(obj);
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-loading {
  padding-top: 300px;
}
&/deep/ .van-button--danger {
  background: #1baeae;
  border: 1px solid #1baeae;
}
</style>