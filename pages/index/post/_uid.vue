<template>
  <div class="post-comp-ct">
    <div class="article">
      <h1 class="title">
        深入理解Nginx及使用Nginx实现负载均衡
      </h1>
      <div class="author">
       <avatar></avatar>
        <div class="info">
          <div class="nickname">
            火锅小王子
          </div>
          <div class="meta">
            <!-- 简书钻 -->
            <span class="jsd-meta">
              <i class="iconfont ic-paid1" /> 4.8
            </span>
            <!-- 如果文章更新时间大于发布时间，那么使用 tooltip 显示更新时间 -->
            <span
              class="publish-time"
              data-toggle="tooltip"
              data-placement="bottom"
              title=""
              data-original-title="最后编辑于 2019.08.22 13:48"
            >2019.08.21 15:15*</span>
            <span class="wordage">字数 2536</span>
            <span class="views-count">阅读 331</span><span class="comments-count">评论 0</span><span class="likes-count">喜欢 15</span>
          </div>
        </div>
      </div>
      <div class="article-content markdown-preview Dark">
        <div v-html="html"></div>
      </div>
      <div class="meta-bottom">
        <div class="like cursor-p">
          <div class="btn-like">
            <i class="el-icon-star-on"></i>喜欢
          </div>
        </div>
      </div>
      <div class="comment-list">
        <form class="new-comment">
          <div class="comment-input-ct">
            <avatar></avatar>
            <textarea
              class="comment-input"
              placeholder="写下你的评论..."
            >
            </textarea>
          </div>
          <div class="write-function-block">
            <el-button style="border: none;" type="text">
              取消
            </el-button>
            <el-button>发送</el-button>
          </div>
        </form>
        <div class="normal-comment-list">
          <div class="top-title">
            2条评论
          </div>
          <div v-for="item in 5" :key="item" class="comment">
            <div>
              <div class="author">
                <div
                  class="v-tooltip-container"
                  style="z-index: 0;"
                >
                  <div
                    class="v-tooltip-content"
                  >
                    <a
                      target="_blank"
                      class="avatar"
                    >
                      <!--<Avatar size="large" icon="ios-person" />-->
                    </a>
                  </div> <!---->
                </div>
                <div class="info">
                  <a href="/u/902d44e549ed" target="_blank" class="name">心生能量</a> <!----> <!---->
                  <div class="meta">
                    <span>3楼 · 2019.08.23 15:21</span>
                  </div>
                </div>
              </div>
              <div class="comment-wrap">
                <p>c2h1aXd1eW91NzIy 如果符合 加我</p>
              </div>
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
import hljs from 'highlight.js/lib/index'
import request from '~/client/api'
import avatar from '~/components/avatar.vue'

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
  asyncData ({ params }) {
    return request.getArticleItem(params.uid)
      .then((data: object) => {
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
    avatar
  }
})
export default class post extends Vue {
  beforeMount () {
    hljs.initHighlightingOnLoad()
  }
}
</script>
<style lang="scss" scoped>
  .post-comp-ct{
    margin: 0 auto;
    padding-top: 20px;
    padding-bottom: 40px;
    width: 620px;
    .article{
      .title{
        /*word-break: break-word!important;*/
        word-break: break-all;
        margin: 20px 0 0;
        font-family: Kai,Kaiti SC,KaiTi,BiauKai,\\6977\4F53,\\6977\4F53_GB2312,Songti SC,serif;
        font-size: 34px;
        font-weight: 700;
        line-height: 1.3;
      }
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
          }
        }
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
        margin: 40px 0 80px;
        .like{
          position: relative;
          width: 123px;
          height: 57px;
          border: 1px solid #EA6F5A;
          border-radius: 40px;
          text-align: center;
          line-height: 57px;
          .btn-like{
            color: #EA6F5A;
            font-size: 19px;
          }
        }
      }
      .comment-list{
        padding-top: 20px;
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
            border-bottom: 1px solid #f0f0f0
          }
          .comment{
            padding: 20px 0 30px;
            border-bottom: 1px solid #f0f0f0;
            &:last-child {
              border-bottom: none;
            }
            .comment-wrap{
              font-size: 16px;
            }
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
