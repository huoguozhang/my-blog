<template>
  <div class="writer-comp-ct">
    <MarkDown
      v-model="md"
      :uploadImageFile="uploadFile"
      :articleTitle.sync="title"
      theme="Dark"
    >
      <a slot="header-right" @click="createArticle">发布文章</a>
    </MarkDown>
  </div>
</template>
<script lang="ts">
/* tslint:disable-next-line */
import moment from 'moment'
import { Loading } from 'element-ui'
import { Vue, Component } from 'vue-property-decorator'
import MarkDown from '~/components/markdown'
import request from '~/client/api'

@Component({
  components: {
    MarkDown
  }
})
export default class Writer extends Vue {
  md: string = ''
  loadingInstance: any = null
  title: string = moment(new Date()).format('YYYY-MM-DD')
  uploadFile (file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.uploadFile(formData)
  }
  createArticle () {
    this.loadingInstance = Loading.service({ text: '文章创建中' })
    request.createArticle({ title: this.title, content: this.md })
      .then(() => {
        this.loadingInstance.close()
        location.href = location.origin
      })
  }
}
</script>
<style lang="scss" scoped>
  .writer-comp-ct {

  }
</style>
