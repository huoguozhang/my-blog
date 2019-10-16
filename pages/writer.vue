<template>
  <div class="writer-comp-ct">
    <MarkDown
      v-model="md"
      theme="Dark"
    >
      <a slot="header-right">发布文章</a>
    </MarkDown>
  </div>
</template>
<script lang="ts">
/* tslint:disable-next-line */
import { Vue, Component } from 'vue-property-decorator'
import MarkDown from '~/components/markdown'
@Component({
  components: {
    MarkDown
  }
})
export default class Writer extends Vue {
  md: string = ''
}
</script>
<style lang="scss" scoped>
  .writer-comp-ct {

  }
</style>
