<template>
  <div class="index">
    <!-- search -->
    <div class="search">
      <div @click="toMapPage">{{locationName}}</div>
      <div>
        <input type="text" placeholder="搜索商品" />
        <span class="searchIcon"></span>
      </div>
    </div>
    <!-- lunbo -->
    <div class="swiper">
      <swiper indicator-dots autoplay circular class="swiper-container">
        <block v-for="(item,index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.image_url" class="swiper-img" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- channelList -->
    <div class="channel">
      <div v-for="(item,index) in channelList" :key="index">
        <img :src="item.icon_url" mode="widthFix" />
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- brandList -->
    <div class="brand">
      <div class="header" @click="handleToMoreBrands">品牌制造商直供 ></div>
      <div class="content">
        <div v-for="(item,index) in brandList" :key="index">
          <div class="des">
            <p>{{item.name}}</p>
            <p>{{item.floor_price}}元起</p>
          </div>
          <img :src="item.new_pic_url" mode="widthFix" />
        </div>
      </div>
    </div>
    <!-- 新品首发 -->
    <div class="newgoods">
      <div class="newgoods-header" @click="handleToGoodsList('isNew')">
        <div class="header-content">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="newgoods-content">
        <ul>
          <scroll-view scroll-x class="scroll-view">
            <li v-for="(item,index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt class="img" />
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 人气推荐 -->
    <div class="newgoods recommendgoods">
      <div class="newgoods-header" @click="handleToGoodsList('isHot')">
        <div class="header-content">
          <p>人气推荐·好物精选</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="newgoods-content">
        <ul>
          <scroll-view scroll-x class="scroll-view">
            <li v-for="(item,index) in recommendGoods" :key="index">
              <img :src="item.list_pic_url" alt class="img" />
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx.js";
import { get, post } from '../../utils/index'
export default {
  data () {
    return {
      banner: [],
      channelList: [],
      brandList: [],
      newGoods: [],
      recommendGoods: []
    };
  },
  components: {},
  mounted () {
    this.getCityName();
    this.getLunbo()
    this.getChannelList()
    this.getBrandList()
    this.getNewGoodsList()
    this.getRecommendGoods()
  },
  onReachBottom: function () {
  },
  async onPullDownRefresh () {
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
  methods: {
    toMapPage () {
      let _this = this;
      // 判断是否已经授权
      wx.getSetting({
        success: res => {
          // 如果没有同意授权，打开设置
          if (!res.authSetting["scope.userLocation"]) {
            wx.openSetting({
              success: res => {
                // 获取授权位置信息
                _this.getCityName();
                wx.navigateTo({
                  url: "/pages/city/main"
                });
              },
              fail: error => {
                console.log(error);
              }
            });
          } else {
            wx.navigateTo({
              url: "/pages/city/main"
            });
          }
        },
        fail: error => {
          consle.log(error);
        }
      });
    },
    // -------- 事件相关函数 ---------
    handleToMoreBrands () {
      wx.navigateTo({
        url: '/pages/morebrands/main'
      })
    },
    handleToGoodsList () {
      wx.navigateTo({
        url: '/pages/goodslist/main'
      })
    },
    // -------- 网络请求相关函数 --------
    getCityName () {
      let _this = this;
      var myAmapFun = new amapFile.AMapWX({
        key: "ecf9dbd07407d49f8a142a5cd2718bec"
      });
      myAmapFun.getRegeo({
        success: data => {
          console.log(data);
          _this.$store.commit("update", {
            locationName: data[0].name
          });
        },
        fail: error => {
          console.log(error);
          this.$store.commit("update", {
            locationName: "北京"
          });
        }
      });
    },
    async getLunbo () {
      const data = await get('/index/lunbo')
      if (data) {
        this.banner = data.banner
      } else {
        alert('获取轮播图失败')
      }
    },
    async getChannelList () {
      const data = await get('/index/channelList')
      if (!data) {
        return wx.showToast({
          title: 'channel数据获取失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        })
      }
      this.channelList = data.channelList
    },
    async getBrandList () {
      const res = await get('/index/brandList')
      if (!res) {
        return wx.showToast({
          title: 'channel数据获取失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        })
      }
      this.brandList = res.brandList
    },
    async getNewGoodsList () {
      const res = await get('/index/newgoods')
      if (!res) {
        return wx.showToast({
          title: 'channel数据获取失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        })
      }
      this.newGoods = res.newGoods
    },
    async getRecommendGoods () {
      const res = await get('/index/recommendgoods')
      this.recommendGoods = res.recommendGoods
    }
  },
  computed: {
    locationName () {
      return this.$store.state.locationName;
    }
  }
};
</script>

<style scoped lang="less">
@import "./style.less";
</style>
