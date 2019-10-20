<template>
  <div class="all-comp-ct">
    <div class="all-header-ct">
      <el-date-picker type="date" placeholder="开始日期" class="w-200 m-r-24" />
      <el-date-picker type="date" placeholder="结束日期" class="w-200 m-r-24" />
      <el-input
        suffix-icon="el-icon-search"
        class="w-200"
        placeholder="搜索：作者 标题 内容"
      >
      </el-input>
    </div>
    <div class="main-ct">
      <article-block
        :article="item"
        v-for="item in articleList"
        :key="item.uid"
      />
      <el-pagination
        class="m-b-24"
        style="float: right;"
        background
        layout="total, jumper, prev, pager, next"
        :current-page.sync="allListParams.page.page"
        :page-size.sync="allListParams.page.limit"
        :total="allListParams.page.totalCount">
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
  getArticleList () {
    request.getArticleList()
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
