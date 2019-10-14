<template>
  <div class="article-block-comp-ct cursor-p" @click="goPost">
    <div class="content">
      <div class="title">
        为什么遍历LinkedList要用增强型for循环为什么遍历LinkedList要用增强型for循环
      </div>
      <div class="abstract">
        for循环和链表介绍 我们都知道java中有个增强型for循环，这个for循环很方便，如果不需要知道当前遍历到第几个的话可以跟普通for循环替换...
      </div>
      <div class="other-info-ct">
        <span class="nickname info-item">
          火锅小王子
        </span>
        <span class="comments info-item">
          <icon icon="pinglun" color=" #409EFF"></icon>
        999+
        </span>
        <span class="like info-item">
          <icon icon="xihuan" color="#F56C6C"></icon>
        999+
        </span>
      </div>
    </div>
    <a href="#" class="cover-img-ct">
      <img class="cover" src="../../assets/image/photo.jpeg" />
    </a>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  mounted (){
    console.log(this.$attrs)
  },
  methods: {
    goPost () {
      this.$router.push({
        path: '/post'
      })
    }
  }
})
export default class articleBlock extends Vue {
}
</script>
<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.article-block-comp-ct {
  position: relative;
  width: 100%;
  margin: 0 0 16px;
  padding: 16px 2px 20px 0;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  text-align: left;
  .content{
    padding-right: 168px;
    .title{
      margin: -8px 0 4px;
      display: inherit;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.5;
    }
    .abstract{
      margin: 0 0 8px;
      font-size: 13px;
      line-height: 24px;
      color: #999;
    }
    .other-info-ct{
      padding-right: 0 !important;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      color: #b4b4b4;
      .nickname{
      }
      .info-item{
        margin-right: 16px;
      }
    }
  }
  .cover-img-ct{
    position: absolute;
    right: 0;
    top: 16px;
    width: 160px;
    .cover{
      width: 100%;
      height: 90px;
    }
  }
}
</style>
