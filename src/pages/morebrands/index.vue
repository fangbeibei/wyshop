<template>
  <div>moreBrands</div>
</template>

<script>
import { get } from '../../utils/index'
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageIndex: 1
      },
      brandList: [],
      amount: 0,
      pageCount: 0
    }
  },
  mounted () {
    this.getMoreBrands()
  },
  methods: {
    async getMoreBrands () {
      const res = await get('/index/morebrands', this.query)
      this.brandList = res.brandList
      this.amount = res.amount
      this.pageCount = res.pageCount
    }
  }
}
</script>

<style>
</style>