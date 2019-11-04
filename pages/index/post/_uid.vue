<template>
  <div class="post-comp-ct">
    <div class="article">
      <h1 class="title">
        {{ article.title }}
      </h1>
      <div class="author">
        <Avatar :user="article.user"></Avatar>
        <div class="info">
          <div class="nickname">
            {{ article.user.nickname }}
          </div>
          <div class="meta">
            <span
              class="publish-time m-r-16"
              data-toggle="tooltip"
              data-placement="bottom"
              :title="`最后编辑于${article.updated_time}`"
            >{{ article.updated_time }}</span>
            <span class="wordage m-r-8">字数 {{ article.word_count }}</span>
            <span class="views-count m-r-8">阅读 {{ article.read_num }}</span>
            <span class="comments-count m-r-8">评论 {{ commentList.length }}</span>
            <span class="likes-count">喜欢 {{ article.like_count }}</span>
            <span
              v-if="userInfo.uid === article.author"
              class="m-l-16 cursor-p edit"
              @click="handleEditClick()"
            >
              编辑文章</span>
          </div>
        </div>
      </div>
      <div class="article-content markdown-preview Dark">
        <div v-html="html"></div>
      </div>
      <el-divider></el-divider>
      <div v-if="likeObj.like_status" class="meta-bottom">
        <span>该文章您点击了<strong>{{ likeObj.like_status === 1 ? '' : '不' }}喜欢</strong></span>
        <div class="undo cursor-p" title="点击撤销操作" @click="changeLikeStatus(0)">
          <img width="18" src="~/assets/image/cancel.svg" />
        </div>
      </div>
      <div v-else class="meta-bottom">
        <div class="like cursor-p">
          <div class="btn-like" @click="changeLikeStatus(1)">
            <img class="m-r-8 heart-img" src="~/assets/image/heart.svg" />喜欢
          </div>
        </div>
        <div class="like unlike cursor-p">
          <div class="btn-like" @click="changeLikeStatus(2)">
            <img class="m-r-8 heart-img" src="~/assets/image/heartbreak.svg" />不喜欢
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <form class="new-comment">
        <div class="comment-input-ct">
          <avatar :avatar="userInfo || {}"></Avatar>
          <textarea
            v-model="inputComment"
            class="comment-input"
            placeholder="写下你的评论..."
          >
            </textarea>
        </div>
        <div class="write-function-block">
          <el-button style="border: none;" type="text">
            取消
          </el-button>
          <el-button @click="addComment">
            发送
          </el-button>
        </div>
      </form>
      <div v-loading="loadingComment" class="normal-comment-list">
        <div class="top-title">
          {{ commentList.length }}条评论
        </div>
        <div v-for="(item, index) in commentList" :key="item.uid" class="comment">
          <div>
            <div class="author">
              <div class="info">
                <Avatar :user="item.user"></Avatar>
                <div class="text-ct">
                  <a
                    :href="`/user/${item.user.uid}`"
                    target="_blank"
                    class="name"
                  >
                    {{ item.user.nickname }}
                  </a>
                  <span v-if="item.author === article.author" class="is-author">
                    作者
                  </span>
                  <div class="meta">
                    <span>{{ index + 2 }}楼 · {{ item.created_time }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="comment-wrap">
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import marked from 'marked/lib/marked'
import { Vue, Component } from 'vue-property-decorator'
import { mapState } from 'vuex'
import hljs from 'highlight.js/lib/index'
import request from '~/client/api'
import Avatar from '~/components/avatar.vue'
import { getToken } from '~/client/utils/token'
const renderer = new marked.Renderer()
marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  highlight (code) {
    return hljs.highlightAuto(code).value
  }
})
@Component({
  name: 'post',
  computed: {
    ...mapState({
      userInfo: (state: any) => state.user.info
    })
  },
  asyncData ({ params }) {
    return request.getArticleItem(params.uid)
      .then((data: object) => {
        // @ts-ignore
        const html = marked(data.content, {
          breaks: true,
          sanitize: false
        })
        return {
          article: data,
          html
        }
      })
  },
  components: {
    Avatar
  }
})
export default class post extends Vue {
  [propName: string]: any
  inputComment: string = ''
  loadingComment: boolean = false
  commentList: Array<object> = []
  likeObj:any = {}
  handleEditClick () {
    this.$router.push({
      path: `/writer?article=${this.article.uid}`
    })
  }
  addComment () {
    let data = {
      content: this.inputComment,
      author: this.userInfo.uid,
      article_uid: this.article.uid,
      article_author: this.article.author
    }
    return request.createCommentOfArticle(data)
      .then(() => {
        this.inputComment = ''
        this.getCommentList()
      })
  }
  async getUserLikeArticleStatus () {
    let params = {
      article_uid: this.article.uid
    }
    this.likeObj = await request.getUserLikeArticleStatus(params)
    if (!this.likeObj.uid) {
      this.likeObj = await request.createUserLikeArticle({ article_uid: this.article.uid, like_status: 0, article_author: this.article.author })
    }
  }
  changeLikeStatus (status) {
    return request.updateUserLikeArticleStatus(this.likeObj.uid, { like_status: status })
      .then(() => {
        this.likeObj.like_status = status
      })
  }
  getCommentList () {
    this.loadingComment = true
    request.getCommentOfArticle({ article_uid: this.article.uid })
      .then((data: any) => {
        this.commentList = data
        this.loadingComment = false
      })
  }
  createArticleReadRecord () {
    request.createArticleReadRecord({ article_uid: this.article.uid })
  }
  beforeMount () {
    hljs.initHighlightingOnLoad()
    if (getToken()) {
      this.getUserLikeArticleStatus()
    }
    this.getCommentList()
  }
  mounted () {
    this.createArticleReadRecord()
  }
}
</script>
<style lang="scss" scoped>
  .post-comp-ct{
    border: 1px solid transparent;
    margin-top: -24px;
    padding-top: 24px;
    background-color: #f9f9f9;
    .author{
      display: flex;
      margin: 30px 0 40px;
      align-items: center;
      .avatar{
        width: 48px;
        height: 48px;
        overflow: hidden;
        border-radius: 50%;
      }
      .info{
        margin-left: 16px;
        .nickname{
          margin-bottom: 8px;
          color: #333;
          font-size: 16px;
        }
        .meta{
          color: #969696;
          .edit{
            font-size: 16px;
            color: #969696;
          }
          .edit:hover{
            color: #409EFF;
          }
        }
      }
    }
    .article{
      margin: 0 auto;
      padding: 24px;
      width: 700px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(26,26,26,.1);
      .title{

        /*word-break: break-word!important;*/
        word-break: break-all;
        margin: 20px 0 0;
        font-family: Kai,Kaiti SC,KaiTi,BiauKai,\\6977\4F53,\\6977\4F53_GB2312,Songti SC,serif;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.3;
      }
      .article-content{
        color: #2f2f2f;
        word-break: break-word!important;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.7;
         overflow: hidden !important;
      }
      .meta-bottom{
        display: flex;
        align-items: center;
        justify-content: center;
        .heart-img{
              width: 24px;
            }
        .like{
          position: relative;
          margin: 0 auto;
          width: 123px;
          height: 57px;
          color: #EA6F5A;
          border: 1px solid;
          border-radius: 40px;
          text-align: center;
          line-height: 57px;
          .btn-like{
            font-size: 19px;
          }
        }
        .unlike{
          color: #bfbfbf;
        }
        .undo{
          margin-left: 16px;
          color: #bfbfbf;
          font-size: 12px;
        }
      }
    }
    .comment-list{
      width: 700px;
      margin: 24px auto;
      padding: 24px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(26,26,26,.1);
      .new-comment{
        .comment-input-ct{
          display: flex;
          align-items: center;
          .avatar-ct{
            margin-right: 16px;
          }
          .comment-input{
            margin-left: 16px;
            padding: 10px 15px;
            flex: 1;
            height: 80px;
            font-size: 13px;
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            background-color: hsla(0,0%,71%,.1);
            resize: none;
            display: inline-block;
            vertical-align: top;
            outline-style: none;
          }
        }
        .write-function-block{
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }
      }
      .normal-comment-list{
        margin-top: 30px;
        .top-title{
          padding-bottom: 20px;
          font-size: 17px;
          font-weight: 700;
          border-bottom: 1px solid #DCDFE6;
        }
        .comment{
          .info{
            display: flex;
            align-items: center;
            .text-ct{
              margin-left: 16px;
              .name{
                display: inline-block;
                margin-bottom: 8px;
              }
              .is-author{
                margin-left: 4px;
                padding: 0 2px;
                font-size: 12px;
                font-weight: normal;
                color: #409EFF;
                border: 1px solid;
                border-radius: 4px;
                user-select: none;
              }
            }
          }
          padding: 20px 0 30px;
          border-bottom: 1px solid #DCDFE6;
          &:last-child {
            border-bottom: none;
          }
          .comment-wrap{
            margin-left: 80px;
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
<style lang="less">
@import "../../../components/markdown/css/theme";
@import "../../../components/markdown/css/dark";
@import "../../../components/markdown/css/index";
/*@import './md-beauty';*/
</style>
