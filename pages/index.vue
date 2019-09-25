<template>
  <div class="index">
    <div class="header-ct m-b-24">
      <div class="header-main">
        <div class="logo-ct" title="本站技术栈:vue vuex vue-router typescript iView ssr node.js mysql">
          Z-blog
        </div>
        <div class="input-ct">
          <input class="search-input" v-model="search" type="text" placeholder="搜索">
        </div>
        <div class="menu-ct">
          <div
            @click="activeMenu(item)"
            :class="{'menu-active': item.value===menuActive}"
            class="menu-item"
            v-for="item in menus"
            :key="item.value">
            {{item.label}}
          </div>
        </div>
        <a href="/writer" target="_blank" style="font-size: 16px;">写文章 <icon icon="edit"></icon></a>
      </div>
    </div>
    <div class="index-content-ct">
      <nuxt-child/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
interface menu {
 label: string, value: number, path: string
}
@Component({
})
export default class index extends Vue {
  menus: Array<menu> = [
    { label: '主页', value: 0, path: '/recommend' },
    { label: '所有文章', value: 1, path: '/all' },
    { label: '我的', value: 2, path: '/my' }
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
  created (): void {
    // console.log(this.$router)
    let path:string = this.$route.path
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
    let item = this.menus.find(menu => menu.path === route.path)
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
        justify-content: space-between;
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
        .menu-ct{
          display: flex;
          align-items: center;
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
