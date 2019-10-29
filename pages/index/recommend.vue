<template>
  <div>
    <div class="recommend-comp-ct">
      <div class="article-ct">
        <el-carousel height="270" loop autoplay>
          <el-carousel-item v-for="(item,i) in 4" :key="item">
            <div :style="{height: '100%'}">
              <img :src="carouselImages[i]" style="width: 100%;">
            </div>
          </el-carousel-item>
        </el-carousel>
        <article-block
          v-for="item in articleList"
          :key="item.uid"
          :article="item"
        />
      </div>
      <div class="right-content">
        <div class="board-ct">
          <a
            v-for="(item, i) in boardList"
            :key="i"
            class="board-item"
            :style="{background: item.bg}"
            target="_blank"
            :href="item.link"
          >
            {{ item.label }}
          </a>
        </div>
        <div class="recommend-user-list">
          <div class="header">
            <span class="title">推荐作者</span>
            <span class="change"><i class="el-icon-refresh"></i> 换一批</span>
          </div>
          <ul class="user-list-ct">
            <li v-for="item in userList" :key="item.uid" class="list-item">
              <Avatar :user="item"></Avatar>
              <div class="info">
                <p class="nickname">
                  {{ item.nickname }}
                </p>
                <p class="level">
                  写了338.k字 · 1.8k 喜欢
                </p>
              </div>
              <a class="follow cursor-p">
                <i class="el-icon-plus"></i>关注
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <footer>
      本站技术: nuxt typescript hapi.js node.js mysql
    </footer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '~/client/api'
import articleBlock from '~/components/article-block/article-block.vue'
import Avatar from '~/components/avatar.vue'
interface Board {
  label: string
  link: string
  bg: string
}
@Component({
  components: {
    articleBlock,
    Avatar
  },
  asyncData () {
    return request.getArticleList().then((data: any) => {
      return { articleList: data.results }
    })
  }
})
export default class recommend extends Vue {
  carouselImages = [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566834099218&di=9567ceea2c7b053d47656cabc07f95c3&imgtype=0&src=http%3A%2F%2Fpic.rmb.bdstatic.com%2F79a52c2a0179484489537079151015d6.jpeg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566834099219&di=d4b11a6516b2f408b0bf7e9611ae3faf&imgtype=0&src=http%3A%2F%2Fdingyue.nosdn.127.net%2FLZ2LnfxeH1lADvrk4PuCD7y1KoGGIkm8r2QMeZSyK4TJO1530549365272compressflag.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566834099220&di=628df78af9ff907cef9142e5df7c1004&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0197595afe676ba801218cf4a555b4.jpg%401280w_1l_2o_100sh.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566834099220&di=9fad79a0fe106223a51129d248625224&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn17%2F600%2Fw1920h1080%2F20180627%2F310c-hencxtv2861523.jpg'
  ]
  boardList: Array<Board> = [
    { label: 'Github', link: 'https://github.com/huoguozhang', bg: '#24292e' },
    { label: '简书博客', link: 'https://www.jianshu.com/u/dfee0b8584c6', bg: '#ea6f5a' },
    { label: '掘金', link: 'https://juejin.im/user/5a1d4f295188252754100f60', bg: '#007fff' },
    { label: 'segmentfault', link: 'https://segmentfault.com/u/huoguoxiaowangzi', bg: '#009a61' }
  ]
  userList = []
  getUserList () {
    request.getUserList()
      .then((data: any) => {
        this.userList = data
      })
  }
  created () {
    this.getUserList()
  }
}
</script>
<style lang="scss" scoped>
.recommend-comp-ct {
  margin: 0 auto;
  width: 944px;
  display: flex;
  .article-ct{
    width: 640px;
  }
  .right-content{
    margin-left: 24px;
    width: 280px;
    .board-ct{
      height: 240px;
      .board-item{
        display: block;
        height: 48px;
        margin-bottom: 16px;
        line-height: 48px;
        color: #fff;
        font-size: 24px;
        text-align: left;
        padding-left: 32px;
        border-radius: 4px;
      }
    }
    .recommend-user-list{
      margin-top: 24px;
      .header{
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #969696;
        .title{
        }
        .change{}
      }
      .user-list-ct{
        .list-item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          color: #333;
          .avatar{
            height: 48px;
            width: 48px;
            overflow: hidden;
            border-radius: 24px;
          }
          .info{
            text-align: left;
            .nickname{
              font-size: 14px;
            }
            .level{
              margin-top: 16px;
              color: #969696;
              font-size: 12px;
            }
          }
          .follow{
            margin-top: 16px;
            padding-top: 6px;
            height: 48px;
            color: #42c02e;
            font-size: 12px;
          }
        }
      }
    }
  }
}
  footer{
    text-align: center;
    margin: 24px auto;
    color: #8c8c8c;
  }
</style>
<style lang="scss">
.recommend-comp-ct {
  .ivu-carousel{
    border-radius: 16px;
    overflow: hidden;
  }
}
</style>
