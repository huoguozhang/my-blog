<template>
  <div class="writer-comp-ct">
    <MarkDown
      ref="md-comp"
      v-model="md"
      :upload-image-file="uploadFile"
      :article-title.sync="title"
      theme="Dark"
    >
      <a slot="header-right" @click="sendRequest">{{ uid ? '更新' : '发布' }}文章</a>
    </MarkDown>
  </div>
</template>
<script lang="ts">
/* tslint:disable-next-line */
import moment from 'moment'
import { Loading } from 'element-ui'
import { Vue, Component } from 'vue-property-decorator'
import { wordCount, getSummary } from '../client/utils/articleHelp'
import MarkDown from '~/components/markdown/index.vue'
import request from '~/client/api'

@Component({
  validate ({ store }) {
    // 未登录不展示
    let userUid = store.state.user.info.uid
    if (!userUid) {
      return
    }
    return userUid
  },
  components: {
    MarkDown
  }
})
export default class Writer extends Vue {
  md: string = ''
  uid: string = ''
  loadingInstance: any = null
  title: string = moment(new Date()).format('YYYY-MM-DD')
  getArticleItem (uid) {
    request.getArticleItem(uid)
      .then((data: any) => {
        this.uid = data.uid
        this.md = data.content
        this.title = data.title
      })
  }
  uploadFile (file) {
    const formData = new FormData()
    formData.append('file', file)
    return request.uploadFile(formData)
  }
  sendRequest () {
    this.loadingInstance = Loading.service({ text: `文章${this.uid ? '修改' : '创建'}中` })
    // @ts-ignore
    const previewNode = this.$refs['md-comp'].$refs.previewInner
    const firstImg = previewNode.querySelector('img')
    let createData: any = {
      title: this.title,
      content: this.md,
      summary: getSummary(previewNode.innerHTML),
      word_count: wordCount(previewNode.textContent)
    }
    if (firstImg) {
      createData.cover = firstImg.src
    }
    const doneAfter = () => {
      this.loadingInstance.close()
      this.$router.push({
        path: '/'
      })
    }
    if (this.uid) {
      request.updateArticleItem(this.uid, createData).then(() => doneAfter())
    } else {
      request.createArticle(createData).then(() => doneAfter())
    }
  }
  created () {
    let uid = this.$route.query && this.$route.query.article
    if (uid) { this.getArticleItem(uid) }
  }
}
</script>
<style lang="scss" scoped>
  .writer-comp-ct {

  }
</style>
