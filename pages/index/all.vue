<template>
  <div class="all-comp-ct">
    <div class="all-header-ct">
      <DatePicker type="date" placeholder="开始日期" class="w-200 m-r-24"></DatePicker>
      <DatePicker type="date" placeholder="结束日期" class="w-200 m-r-24"></DatePicker>
      <my-input class="w-200" placeholder="搜索：作者 标题 内容" >
        <Button slot="append" icon="ios-search"></Button>
      </my-input>
    </div>
    <div class="main-ct">
      <article-block v-for="item in 10" :key="item"></article-block>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import articleBlock from '~/components/article-block/article-block.vue'
import { Input, Card, DatePicker, Button } from 'iview'
@Component({
  name: 'all',
  components: {
    articleBlock, myInput: Input, Card, DatePicker, Button
  }
})
export default class ALl extends Vue {
}
</script>
<style lang="scss" scoped>
.all-comp-ct {
  .all-header-ct{
    margin: 0 auto;
    width: 700px;
    display: flex;
    align-items: center;
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
