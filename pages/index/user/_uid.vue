<template>
  <div class="user-comp-ct">
    <div class="left">
      <div class="top">
        <div class="avatar-ct">
          <img v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" />
          <div v-else class="none">
            暂无头像
          </div>
        </div>
        <div class="info-ct">
          <div class="nickname">
            {{ userInfo.nickname }}
          </div>
          <div class="other-info">
            <div class="item">
              文章
              <div>{{ userInfo.article_sum }}</div>
            </div>
            <div class="item">
              字数
              <div>{{ userInfo.word_sum }}</div>
            </div>
            <div class="item">
              收获喜欢
              <div>{{ userInfo.like_sum }}</div>
            </div>
          </div>
        </div>
      </div>
      <el-tabs>
        <el-tab-pane icon="md-document" label="文章">
          <div class="infinite-list-wrapper">
             <article-block
            v-for="(item, i) in userArticleList"
            :key="item.uid"
            :show-action-btn="uid === currentUserInfo.uid"
            :article="item"
            @delete="handleDelete(i)"
            @edit="handleEdit(item.uid)"
          />
          </div>
          <infiniteScroll v-loading="loading" :disabled="disabled" :load-data="getUserArticleList">
            <div class="no-more" v-if="!loading && noMore">
              没有更多数据
            </div>
          </infiniteScroll>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right">
      <div class="title">
        <span>个人简介</span>
        <span v-if="uid === currentUserInfo.uid" class="cursor-p" @click="beforeEdit">编辑</span>
      </div>
      <div class="description" v-text="userInfo.description">
      </div>
    </div>
    <el-dialog :visible.sync="showEditForm" title="编辑资料">
      <el-form ref="form" label-width="80px" style="width: 300px;margin: 0 auto;">
        <el-form-item label="头像" :model="userForm" :rules="userFormRules">
          <imageUpload v-model="userForm.avatar" />
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input :value="userForm.username" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" class="w-200" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" class="w-200" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userForm.description" class="my-textarea" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button @click="showEditForm = false">
            取消
          </el-button>
          <el-button type="primary" @click="submitForm">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { mapState } from 'vuex'
import { Vue, Component } from 'vue-property-decorator'
import articleBlock from '~/components/article-block/article-block.vue'
import imageUpload from '~/components/imageUpload.vue'
import infiniteScroll from '~/components/infiniteScroll/infiniteScroll.vue'
import request from '~/client/api'

interface UserForm {
  username: string
  nickname: string
  password: string
  description: string,
  avatar: string
}
@Component({
  computed: {
    ...mapState({
      // @ts-ignore
      currentUserInfo: state => state.user.info
    })
  },
  components: {
    articleBlock, imageUpload, infiniteScroll
  },
  asyncData ({ params }) {
    return request.getUserInfo({ uid: params.uid })
      .then((data: any) => {
        return { userInfo: data }
      })
  }
})
export default class User extends Vue {
  [propName: string]: any
  loading = false
  userFormRules: any = {
    username: [
      { required: true, message: '请填写用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请填写密码', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请填写昵称', trigger: 'blur' }
    ]
  }
  showEditForm: boolean = false
  userForm: UserForm = {
    username: '',
    password: '',
    description: '',
    avatar: '',
    nickname: ''
  }
  userArticleList = []
  page = {
    page: 1,
    limit: 10,
    totalCount: 0
  }
  get uid () {
    return this.$route.params.uid
  }

  get noMore () {
    return this.userArticleList.length >= this.page.totalCount
  }

  get disabled () {
    return this.loading || this.noMore
  }
  beforeEdit () {
    this.showEditForm = true
    this.userForm = { ...this.userForm, ...this.userInfo }
  }
  submitForm () {
    const data = {
      nickname: this.userForm.nickname,
      password: this.userForm.password,
      avatar: this.userForm.avatar,
      description: this.userForm.description
    }
    request.updateUserInfo(this.uid, data).then(() => {
      // @ts-ignore
      this.$refs.form.resetFields()
      this.showEditForm = false
      this.getUserInfo()
    })
  }
  getUserInfo () {
    request.getUserInfo({ uid: this.uid })
      .then((data: any) => {
        this.userInfo = data
      })
  }
  getUserArticleList () {
    this.loading = true
    request.getArticleList({ author: this.uid, page: this.page.page, limit: this.page.limit })
      .then((data: any) => {
        this.userArticleList.push(...data.results)
        this.page.totalCount = data.totalCount
        this.loading = false
        this.page.page++
      })
  }
  handleDelete (i) {
    this.page.totalCount--
    request.deleteArticleItem(this.userArticleList[i].uid)
      .then(() => {
        this.userArticleList.splice(i, 1)
      })
  }
  handleEdit (uid) {
    this.$router.push({
      path: '/writer',
      query: {
        article: uid
      }
    })
    console.log('edit')
  }
  created () {
    // this.getUserArticleList()
  }
}
</script>
<style lang="scss" scoped>
.user-comp-ct {
  display: flex;
  margin: 0 auto;
  width: 900px;
  .left{
    width: 700px;
    .top{
      padding: 0 16px;
      display: flex;
      margin-bottom: 24px;
      .avatar-ct{

        width: 80px;
        height: 80px;
        border-radius: 40px;
        overflow: hidden;
        .none{
          text-align: center;
          line-height: 80px;
          background: #3e76f6;
        }
        .avatar{
          width: 80px;
          height: 80px;
        }
      }
      .info-ct{
        margin-left: 24px;
        .nickname{
          height: 31px;
          font-size: 21px;
          font-weight: 700;
        }
        .other-info{
          display: flex;
          .item{
            height: 42px;
            line-height: 1.7;
            font-size: 12px;
            margin: 0 7px 6px 0;
            padding: 0 7px 0 0;
            border-right: 1px solid #f0f0f0;
          }
        }
      }
    }
  }
  .right{
    margin-left: 24px;
    /*border: 1px solid;*/
    flex: 7;
    .title{
      display: flex;
      padding: 16px;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 14px;
      color: #969696;
    }
    .description{
      padding: 0 16px;
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
  .user-comp-ct{
    .my-textarea{
    }
  }
</style>
