<template>
  <div class="writer-comp-ct">
    <MarkDown
      ref="md-comp"
      v-model="md"
      :upload-image-file="uploadFile"
      :article-title.sync="title"
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
import { wordCount, getSummary } from '../client/utils/articleHelp'
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
    const previewNode = this.$refs['md-comp'].$refs.previewInner
    const firstImg = previewNode.querySelector('img')
    let createData = {
      title: this.title,
      content: this.md,
      summary: getSummary(previewNode.innerHTML),
      word_count: wordCount(previewNode.textContent)
    }
    if (firstImg) {
      createData.cover = firstImg.src
    }
    request.createArticle(createData)
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
