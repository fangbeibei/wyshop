<template>
  <div class="index">
    <!-- search -->
    <div class="search">
      <div @click="toMapPage">{{locationName}}</div>
      <div @click="handleToSearch">
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
    <!-- 专题精选 -->
    <div class="topic-list">
      <div class="topic-list-header">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="topic-list-content">
        <ul>
          <scroll-view scroll-x class="scroll-view">
            <li
              v-for="(item,index) in topicList"
              :key="index"
              @click="handleToTopicDetial(item.id)"
            >
              <img :src="item.scene_pic_url" />
              <div class="title">
                <p>{{item.title}}</p>
                <p>{{item.price_info}}元起</p>
              </div>
              <p class="subtitle">{{item.subtitle}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 好物列表 -->
    <div class="category">
      <div class="category-item" v-for="(item,index) in categoryList" :key="index">
        <div class="item-header">{{item.name}}好物</div>
        <div class="item-content">
          <div
            class="item-content-item"
            v-for="(item1,index1) in item.goodsList"
            :key="index1"
            @click="handleToGoodsDetial(item1.id)"
          >
            <img :src="item1.list_pic_url" />
            <p>{{item1.name}}</p>
            <p>￥{{item1.retail_price}}</p>
          </div>
          <div class="last" @click="handleToCategeryGoods(item.id)">
            <p>{{item.name}}好物</p>
            <div class="icon"></div>
          </div>
        </div>
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
      recommendGoods: [],
      topicList: [],
      categoryList: []
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
    this.getTopicList()
    this.getCategoryList()
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
    handleToTopicDetial (id) {
      wx.navigateTo({ url: '/pages/topicdetial/main?id=' + id });
    },
    handleToGoodsDetial (id) {
      console.log(id)
      wx.navigateTo({ url: '/pages/goodsdetial/main' });
    },
    handleToCategeryGoods (id) {
    },
    handleToSearch () {
      wx.navigateTo({ url: '/pages/search/main' });
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
    },
    async getTopicList () {
      const res = await get('/index/topiclist')
      if (!res) {
        wx.showToast({
          title: '获取精选专题失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      }
      this.topicList = res.topicList
    },
    async getCategoryList () {
      const res = await get('/index/categorylist')
      this.categoryList = res.categoryList
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
