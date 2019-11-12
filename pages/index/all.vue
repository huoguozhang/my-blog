<template>
  <div class="all-comp-ct">
    <div class="all-header-ct">
      <el-date-picker
        v-model="allListParams.startDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始日期"
        class="w-200 m-r-24"
        @change="handleSearchChange"
      />
      <el-date-picker
        v-model="allListParams.endDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="结束日期"
        class="w-200 m-r-24"
        @change="handleSearchChange"
      />
      <el-input
        v-model="allListParams.search"
        suffix-icon="el-icon-search"
        class="w-200"
        placeholder="搜索：作者 标题 内容"
        @change="handleSearchChange"
      >
      </el-input>
    </div>
    <div class="main-ct">
      <article-block
        v-for="item in articleList"
        :key="item.uid"
        :article="item"
      />
      <el-pagination
        class="m-b-24"
        style="float: right;"
        background
        layout="total, jumper, prev, pager, next, sizes"
        :current-page.sync="allListParams.page.page"
        :page-size.sync="allListParams.page.limit"
        :total="allListParams.page.totalCount"
        @size-change="getArticleList"
        @current-change="getArticleList"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import articleBlock from '~/components/article-block/article-block.vue'
import request from '~/client/api'

@Component({
  name: 'all',
  components: {
    articleBlock
  }
})
export default class ALl extends Vue {
  articleList = []
  allListParams = {
    search: '',
    startDate: '',
    endDate: '',
    page: {
      page: 1,
      limit: 10,
      totalCount: 0
    }
  }
  handleSearchChange () {
    this.allListParams.page = {
      page: 1,
      limit: 10,
      totalCount: 0
    }
    this.getArticleList()
  }
  getArticleList () {
    let params:any = {
      limit: this.allListParams.page.limit,
      page: this.allListParams.page.page
    }
    if (this.allListParams.startDate) {
      params.start_date = this.allListParams.startDate
    }
    if (this.allListParams.endDate) {
      params.end_date = this.allListParams.endDate
    }
    if (this.allListParams.search) {
      params.search = this.allListParams.search
    }
    request.getArticleList(params)
      .then((data: any) => {
        this.articleList = data.results
        this.allListParams.page.totalCount = data.totalCount
      })
  }
  created () {
    this.getArticleList()
  }
}
</script>
<style lang="scss" scoped>
.all-comp-ct {
  .all-header-ct{
    margin: 0 auto;
    width: 700px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .w-200{
    width: 200px;
  }
  .main-ct{
    margin: 24px auto;
    width: 700px;
  }
}
</style>
