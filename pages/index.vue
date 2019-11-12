<template>
  <div class="index">
    <div class="header-ct m-b-24">
      <div class="header-main">
        <div class="logo-ct" title="本站技术栈:vue vuex vue-router typescript iView ssr node.js mysql">
          Z-blog
        </div>
        <div class="menu-ct">
          <div
            v-for="item in menus"
            :key="item.value"
            :class="{'menu-active': item.value===menuActive}"
            class="menu-item"
            @click="activeMenu(item)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="input-ct">
          <el-autocomplete
            v-model="search"
            :trigger-on-focus="false"
            suffix-icon="el-icon-search"
            :fetch-suggestions="handleSearch"
            class="search-input"
            placeholder="搜索用户或者文章"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div
                v-if="item.type==='user'"
                class="search-res-user-item"
              >
                <el-tag
                  type="success"
                >
                  用户
                </el-tag>
                <Avatar :width="24" class="m-l-8 m-r-8" :user="item"></Avatar>
                <div class="nickname">
                  {{ item.nickname }}
                </div>
              </div>
              <div
                v-else-if="item.type='article'"
                class="search-res-article-item"
              >
                <el-tag>文章</el-tag>
                <div class="m-l-8 title single-row-ellipsis">
                  {{ item.title }}
                </div>
              </div>
              <!--<div class="label">
                {{ item.type === 'user' ? item.nickname : item.title }}
              </div>
              <span v-if="item.type==='user'" class="description">{{ item.description }}</span>
              <span v-else class="description">{{ item.summary }}</span>-->
            </template>
          </el-autocomplete>
        </div>
        <div class="writer-ct">
          <div class="user-info-ct">
            <a v-if="userInfo.uid" :href="'/user/' + userInfo.uid" class="user-info">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              {{ userInfo.nickname }}
            </a>
            <a v-else href="/login">登录</a>
          </div>
          <el--button
            v-if="userInfo.uid"
            class="el-button el-button--default el-button--medium is-round"
            style="font-size: 16px;"
            @click="goWriter"
          >
            写文章 <i class="el-icon-edit-outline"></i>
          </el--button>
        </div>
      </div>
    </div>
    <div class="index-content-ct">
      <nuxt-child />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from 'vuex'
import { Vue, Component, Watch } from 'vue-property-decorator'
import request from '~/client/api'
import { getToken } from '~/client/utils/token'
import Avatar from '~/components/avatar.vue'
interface menu {
 label: string, value: number, path: string
}
@Component({
  components: { Avatar },
  computed: {
    ...mapState({
      userInfo: (state: any) => state.user.info
    })
  },
  methods: {
    ...mapActions('user', ['getUserInfo'])
  }
})
export default class index extends Vue {
  [propName: string]: any
  menus: Array<menu> = [
    { label: '主页', value: 0, path: '/recommend' },
    { label: '所有文章', value: 1, path: '/all' }
  ]
  menuActive:number = -1
  search: string = ''
  activeMenu (item: menu):void {
    if (item.value !== this.menuActive) {
      this.menuActive = item.value
    }
    if (item.path === this.$route.path) {
      return
    }
    this.menuActive = item.value
    this.$router.push({ path: item.path })
  }
  async handleSearch (search, cb) {
    const users = await request.getUserList({ search })
    const articles = await request.getArticleList({ search })
    const userData = users.map((v) => {
      v.type = 'user'
      return v
    })
    const articleData = articles.results.map((v) => {
      v.type = 'article'
      return v
    })
    const result = [ ...userData, ...articleData ]
    cb(result)
  }
  handleSelect (item) {
    const typePathMap = {
      user: 'user',
      article: 'post'
    }
    let path = `/${typePathMap[item.type]}/${item.uid}`
    this.$router.push({
      path
    })
  }
  goWriter () {
    this.$router.push({
      path: '/writer'
    })
  }
  mounted () {
    if (getToken()) {
      this.getUserInfo()
    }
  }
  created (): void {
    const path:string = this.$route.path
    let item = this.menus.find(menu => menu.path === path)
    if (item) {
      this.activeMenu(item)
    } else if (path === '/') {
      item = this.menus.find(menu => menu.path === '/recommend')
      this.activeMenu(item!)
    }
  }
  @Watch('$route')
  function (route: any) {
    const item = this.menus.find(menu => menu.path === route.path)
    if (!item) {
      this.menuActive = -1
    }
  }
}
</script>
<style lang="scss">
  .search-res-user-item{
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .nickname{
    }
  }
  .search-res-article-item{
    display: flex;
    align-items: center;
  }
  .index{
    padding-top: 104px;
    .header-ct{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: #fff;
      border-bottom: 1px solid #f0f0f0;
     /* background-color: #111111;*/
      z-index: 999;
      .header-main{
        display: flex;
        align-items: center;
        height: 100%;
        width: 1200px;
        margin: 0 auto;
        .logo-ct{
          font-family: ProximaNova-Extrabld;
          font-size: 32px;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 0px;
          /*color: #ffffff;*/
        }
        .input-ct{
          margin: 0 64px;
          .search-input .el-input{
            transition: width .5s;
            &.el-input__inner:focus{
              width: 240px;
            }
          }
          li {
            line-height: normal;
            padding: 7px;

            .label {
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .description {
              font-size: 12px;
              color: #b4b4b4;
            }

            .highlighted .addr {
              color: #ddd;
            }
  }
        }
        .user-info-ct{
          display: flex;
          align-items: center;
          margin-right: 16px;
          color: #409EFF;
          .avatar{
            width: 40px;
            height: 40px;
            overflow: hidden;
            border-radius: 50%;
          }
        }
        .writer-ct{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .menu-ct{
          display: flex;
          align-items: center;
          margin: 0 64px;
          .menu-item{
            height: 80px;
            padding: 0 24px;
            line-height: 80px;
            font-family: NexaBold;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            /*color: #cccccc;*/
            cursor: pointer;
            color: #000000;
          }
          .menu-active, .menu-item:hover{
            /*color: #fff;*/
            color: #409EFF;
          }
        }
      }
    }
    .index-content-ct{
      min-width: 1200px;
    }
  }
</style>
