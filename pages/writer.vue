<template>
  <div class="writer-comp-ct">
    <MarkDown
      theme="Dark"
      :toolbars="{
       }">
      <a slot="header-right">发布文章</a>
    </MarkDown>
  </div>
</template>
<script>
/* tslint:disable-next-line */
import MarkDown from '~/components/markdown'
export default {
  name: 'writer',
  components: {
    MarkDown
  }
}
</script>
<style lang="scss" scoped>
  .writer-comp-ct {

  }
</style>
