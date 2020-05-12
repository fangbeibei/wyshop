<template>
  <div class>
    <!-- 搜索 -->
    <div class="search">
      <div class="search-input">
        <span class="search-icon"></span>
        <input
          type="text"
          confirm-type="search"
          placeholder="商品搜索"
          autofocus
          v-model="queryInfo.keywords"
          @input="handleSearchInput"
          @confirm="handleSearch"
          @focus="handleSearchInputFocus"
        />
        <span class="search-clear-icon" @click="handleSearchClear" v-if="queryInfo.keywords"></span>
      </div>
      <div class="search-cancel" @click="handleCancelSearch" v-if="!queryInfo.keywords">取消</div>
      <div class="search-confirm" @click="handleSearch" v-else>搜索</div>
    </div>
    <!-- 搜索Tips -->
    <div class="search-tips" v-show="queryInfo.keywords && goodsList.length == 0">
      <div class="tips-box" v-if="tips.length > 0">
        <span
          v-for="(item,index) in tips"
          :key="index"
          @click="handleSearch($event,item.name)"
        >{{item.name}}</span>
      </div>
      <div class="search-notips" v-else>
        <span>数据库暂无此类商品</span>
      </div>
    </div>
    <!-- 历史 -->
    <div class="history" v-show="historyList.length > 0 && goodsList.length == 0">
      <div class="history-top">
        <span>历史记录</span>
        <span class="history-clear-icon" @click="handleClearHistory"></span>
      </div>
      <div class="history-content">
        <span
          class="history-item"
          v-for="(item,index) in historyList"
          :key="index"
          @click="handleSearch($event,item.keyword)"
        >{{item.keyword}}</span>
      </div>
    </div>
    <!-- 热门 -->
    <div class="hot-search" v-show="hotSearch.length > 0 && goodsList.length == 0">
      <div class="hot-search-top">
        <span>热门搜索</span>
      </div>
      <div class="hot-search-content">
        <span
          class="hot-search-item"
          v-for="(item,index) in hotSearch"
          :key="index"
          :class="{'active':item.is_hot,'hot-search-item':true}"
          @click="handleSearch($event,item.keyword)"
        >{{item.keyword}}</span>
      </div>
    </div>
    <!-- 商品列表-->
    <scroll-view
      scroll-y
      @scrolltolower="handleScollToButtom"
      class="goodslist"
      v-if="goodsList.length > 0"
    >
      <div class="goodslist-tab">
        <span :class="[nowTab === 0 ? 'active':'']" @click="handleTabClick(0)">综合</span>
        <span :class="[nowTab === 1 ? 'active':'','price']" @click="handleTabClick(1)">
          价格
          <i class="order-shengxu-icon" v-if="shengxuIcon"></i>
          <i class="order-jianxu-icon" v-else-if="jianxuIcon"></i>
          <i class="order-normal-icon" v-else></i>
        </span>
        <span :class="[nowTab === 2 ? 'active':'']" @click="handleTabClick(2)">分类</span>
      </div>
      <div class="goodslist-content">
        <div
          class="goodslist-item"
          v-for="(item,index) in goodsList"
          :key="index"
          @click="handleGoodsItemClick(item.id)"
        >
          <img :src="item.list_pic_url" alt />
          <p>{{item.name}}</p>
          <p>￥{{item.retail_price}}</p>
        </div>
      </div>
      <div v-if="queryInfo.pageIndex >= pagesAmount" class="buttom">到底啦~</div>
    </scroll-view>
  </div>
</template>
<script>
import { get, post, mydelete } from '../../utils/index'

export default {
  data () {
    return {
      tips: [],
      openId: '',
      historyList: [],
      hotSearch: [],
      goodsList: [],
      goodsAmount: 0,
      pagesAmount: 0,
      queryInfo: {
        keywords: '',
        orderBy: 'id',
        orderType: 'asc',
        pageSize: 10,
        pageIndex: 0
      },
      nowTab: 0
    }
  },
  mounted () {
    this.openId = wx.getStorageSync('openId');
    this.getHistorySearch()
    this.getHotSearch()
  },
  methods: {
    //----------------- 网络请求 -----------------
    // 获取历史搜索
    async getHistorySearch () {
      const res = await get('/search/historysearch', {
        openId: this.openId
      })
      this.historyList = res.data
    },
    // 获取热门搜索
    async getHotSearch () {
      const res = await get('/search/hotsearch')
      if (res.code !== 200) {
        wx.showToast({
          title: '获取热门搜索失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      } else {
        this.hotSearch = res.data
      }
    },
    // 添加历史记录
    async addHistorySearch () {
      if (this.queryInfo.keywords == 0) {
        return
      }
      const res = await post('/search/historysearch', {
        openId: this.openId,
        keywords: this.queryInfo.keywords
      })
      if (res.code !== 200) {
        wx.showToast({
          title: '添加历史记录失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      } else {
        this.getHistorySearch()
      }
    },
    // 获取商品列表
    async getGoodsList () {
      this.queryInfo.pageIndex++
      const res = await get('/search/goodslist', this.queryInfo)
      this.goodsList = [...this.goodsList, ...res.data]
      this.goodsAmount = res.goodsAmount
      this.pagesAmount = res.pagesAmount
    },
    // 获取tips信息
    async getTips () {
      const res = await get('/search/tips', {
        keywords: this.queryInfo.keywords
      })
      if (res.code !== 200) {
        wx.showToast({
          title: '获取tips失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      } else {
        this.tips = res.data
      }
    },
    // ------------------ 事件函数 --------------------
    // 搜索框输入
    async handleSearchInput () {
      this.getTips()
    },
    // 清楚搜索框
    handleSearchClear () {
      this.queryInfo.keywords = ''
      console.log(this.$refs)
    },
    // 取消搜索
    handleCancelSearch () {
      this.queryInfo.keywords = ''
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    },
    // 搜索
    async handleSearch (e, word) {
      this.tips = []
      this.queryInfo.pageIndex = 0
      this.goodsList = []
      if (word) {
        this.queryInfo.keywords = word
      }
      if (!this.queryInfo.keywords.trim()) {
        return
      }
      this.addHistorySearch()
      this.getGoodsList()
    },
    // 清空历史搜索
    async handleClearHistory () {
      const res = await mydelete('/search/historysearch/' + this.openId)
      if (res.code !== 200) {
        wx.showToast({
          title: '清空失败', //提示的内容,
          duration: 1000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
      } else {
        this.historyList = []
        console.log('清除成功')
      }
    },
    // 聚焦搜索框的时候
    handleSearchInputFocus () {
      this.goodsList = []
      this.getTips()
    },
    // 点击切换tab
    handleTabClick (tab) {
      this.nowTab = tab
      if (this.nowTab == 1) {
        this.queryInfo.orderBy = 'retail_price'
        this.queryInfo.orderType = this.queryInfo.orderType == 'asc' ? 'desc' : 'asc'
      } else if (this.nowTab == 0) {
        this.queryInfo.orderBy = 'id'
        this.queryInfo.orderType = 'asc'
      }
      this.handleSearch()
    },
    // 当商品列表滑动到底部
    handleScollToButtom () {
      if (this.queryInfo.pageIndex >= this.pagesAmount) {
        return
      }
      this.getGoodsList()
    },
    // 当点击每一个item的时候
    handleGoodsItemClick (id) {
      wx.navigateTo({ url: '/pages/goodsdetial/main?id=' + id });
    }
  },
  computed: {
    shengxuIcon: function () {
      return this.queryInfo.orderBy == 'retail_price' && this.queryInfo.orderType == 'asc'
    },
    jianxuIcon: function () {
      return this.queryInfo.orderBy == 'retail_price' && this.queryInfo.orderType == 'desc'
    }
  }
}
</script>
<style lang="less" scope>
@import "./style.less";
</style>