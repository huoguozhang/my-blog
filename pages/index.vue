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
          <input v-model="search" class="search-input" type="text" placeholder="搜索">
        </div>
        <div class="writer-ct">
          <div class="user-info-ct">
            <a v-if="userInfo.uid" :href="'/user/' + userInfo.uid" class="user-info">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              {{ userInfo.nickname }}
            </a>
            <a v-else href="/login">登录</a>
          </div>
          <el-button v-if="userInfo.uid" round>
            <a href="/writer" target="_blank" style="font-size: 16px;">写文章 <i class="el-icon-edit-outline"></i></a>
          </el-button>
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

interface menu {
 label: string, value: number, path: string
}
@Component({
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
  mounted () {
    this.getUserInfo()
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
  .index{
    padding-top: 80px;
    .header-ct{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 80px;
      background: #f7f7f7;
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
          .search-input{
            outline: none;
            padding: 0 40px 0 20px;
            width: 160px;
            height: 38px;
            font-size: 14px;
            border: 1px solid #eee;
            border-radius: 40px;
            background: #eee;
            transition: width .5s;
            transition-delay: .1s;
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
            color: #999999;
          }
          .menu-active, .menu-item:hover{
            /*color: #fff;*/
            color: #000000;
          }
        }
      }
    }
    .index-content-ct{
      width: 1200px;
      margin: 24px auto;
    }
  }
</style>
