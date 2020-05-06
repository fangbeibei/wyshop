<template>
  <div class="city">
    <input type="text" placeholder="搜索" @input="handleInput" v-model="keywords" />
    <scroll-view scroll-y class="tips">
      <div v-for="(item,index) in tips" :key="index" class="tip" @click="handleScrollItemClick(item.name)">{{item.name}}</div>
    </scroll-view>
    <div class="map">
      <div class="map-title">显示当前位置：</div>
      <map class="map-view" id="map" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx";
export default {
  data() {
    return {
      tips: [],
      longitude: 0,
      latitude: 0,
      markers: [],
      keywords: ""
    };
  },
  methods: {
    handleInput(e) {
      let _this = this;
      _this.tips = [];
      var myAmapFun = new amapFile.AMapWX({
        key: "ecf9dbd07407d49f8a142a5cd2718bec"
      });
      myAmapFun.getInputtips({
        keywords: _this.keywords,
        location: "",
        success: res => {
          if (res && res.tips) {
            _this.tips = res.tips;
          }
        },
        fail: error => {
          console.log(res);
        }
      });
    },
    handleScrollItemClick(locationName){
      this.$store.commit('update',{
        locationName
      })
      this.keywords=''
      this.tips = []
      //返回上一级
      wx.navigateBack({
        delta: 1
      });
    }
  },
  mounted() {
    let _this = this;
    var myAmapFun = new amapFile.AMapWX({
      key: "ecf9dbd07407d49f8a142a5cd2718bec"
    });
    myAmapFun.getRegeo({
      iconPath: "/static/images/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function(data) {
        _this.longitude = data[0].longitude;
        _this.latitude = data[0].latitude;
        _this.markers.push({
          id: data[0].id,
          name: data[0].name,
          desc: data[0].desc,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        });
      },
      fail: function(error) {
        console.log(error);
      }
    });
  }
};
</script>

<style lang="less">
@import url("./style.less");
</style>