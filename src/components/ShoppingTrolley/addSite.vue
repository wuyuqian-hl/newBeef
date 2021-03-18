<template>
  <div>
    <!-- 新增 -->
    <div v-if="NewArred">
      <!-- 新增地址头 -->
      <sHeader :name="'新增地址'"></sHeader>
      <!-- 地址编辑 编辑信息 地区列表 邮政编码  默认地址栏 搜索结果 地区选择占位文字-->
      <van-address-edit
        :area-list="areaList"
        show-postal
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
    <!-- 修改 -->
    <div v-else>
      <sHeader :name="'修改地址'"></sHeader>
      <van-address-edit
        :area-list="areaList"
        :address-info="address_info"
        show-area
        show-delete
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSaveChange"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      />
    </div>
  </div>
</template>

<script>
import sHeader from "../public/navHeader";
import Addres from "../Address/Address";
export default {
  components: {
    sHeader,
  },
  data() {
    return {
      areaList: {
        province_list: Addres.province_list, //省份
        city_list: Addres.city_list, //区域
        county_list: Addres.county_list, //渔区
      }, //地区列表
      NewArred: this.$store.state.NewArred,
      searchResult: [],
      address_info: this.$route.query.AddList,
    };
  },
  created() {
    console.log(this.$route.query.AddList);
  },
  methods: {
    // 新增保存
    onSave(city) {
      this.$http
        .post("/api/v1/address", {
          cityName: city.city,
          defaultFlag: city.isDefault ? 1 : 0,
          detailAddress: city.addressDetail,
          provinceName: city.province,
          regionName: city.county,
          userName: city.name,
          userPhone: city.tel,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.$toast.success("保存成功");
            this.$router.push("/SubmitOrder");
          } else {
            this.$toast.fail("保存失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 修改保存
    onSaveChange(city) {
      this.$http
        .put("/api/v1/address", {
          addressId: city.id,
          cityName: city.city,
          defaultFlag: city.isDefault ? 1 : 0,
          detailAddress: city.addressDetail,
          provinceName: city.province,
          regionName: city.county,
          userId: city.userId,
          userName: city.name,
          userPhone: city.tel,
        })
        .then((res) => {
          console.log(res);
          if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
            this.$toast.success("保存成功");
            this.$router.push("/SubmitOrder");
          } else {
            this.$toast.fail("保存失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 删除
    onDelete(user) {
      this.$http.delete("/api/v1/address/" + user.id).then((res) => {
        if (res.data.message == "SUCCESS" && res.data.resultCode == 200) {
          this.$toast.success("删除成功");
          this.$router.push("/SubmitOrder");
        }
      });
    },
    // 修改详细地址时触发
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区",
          },
        ];
      } else {
        this.searchResult = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
&/deep/ .van-button--danger {
  background: #1baeae;
  border: 1px solid #1baeae;
}
</style>