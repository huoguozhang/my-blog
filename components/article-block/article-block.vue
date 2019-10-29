<template>
  <div class="article-block-comp-ct">
    <div class="content">
      <div class="title  cursor-p" @click="goPost">
        {{ article.title }}
      </div>
      <div class="abstract two-row-ellipsis">
        {{ article.summary }}
      </div>
      <div class="other-info-ct">
        <span class="nickname info-item">
          <i class="el-icon-user-solid"></i>
          {{ (article.user && article.user.nickname) || '佚名' }}
        </span>
        <span class="comments info-item">
          <i class="el-icon-s-comment"></i>
          {{ article.comment_count }}
        </span>
        <span class="like info-item">
          <img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABp0lEQVRIie2Tv0sbYRjHP9/r+ROKq+DkEJBqTEwiOPkXiEOXUqW6KLq04ty9u2vBJergqrgKugVMSWxFSqBbFzddLtEkj4O5JNrzkkqy+V1e7nne9/O543kPXtMian6wQqGP6+IasgVgArgDLjHbYcDd1vj4LYBdXPTilVeQPgFjQA/wC2mPt/3fFYmU/hFYLjdCxTkCYs+8zBnmzuMUhbkHQDJwl1kO1+YUj/+tC6xQ6OPGy4TA/WRrazC8WTI0OKNIpOQAcF1cawPug8PhAFKcG28V4EHgsNgG/H+z2BCYveuCYKIhgGoXBJVmQa4LgnxDIKU7jjfbaQiqpTRw2UH8bwbcdF2gVOoOaQnwOgAvYrbs//X+DFAiegb2gdpwXhgDrSoVy/gFp7mrZOwQsy+87FYZZptKRncfMQN3Zn++B9sD+tuEl5HWlYhuP20ECgDsx/ksxj4w3AJ+BfZRydhxUNMJKgIoMXlK5c0UEHiwlhNUnnoODiFf4MfMHLLnn5G+AYO1sgd8JRHdkhQ6r5aCuiifH6XsbEFVVLWh6ck/7Z59TWjuAdZJgO+2en4sAAAAAElFTkSuQmCC">
          {{ article.like_count }}
        </span>
        <span class="read_num info-item">
          <i class="el-icon-view"></i>
          {{ article.read_num }}
        </span>
      </div>
    </div>
    <a v-if="article.cover" href="#" class="cover-img-ct">
      <img class="cover" :src="article.cover">
    </a>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({})
export default class articleBlock extends Vue {
  @Prop({ type: Object, default: () => ({}) }) article!: object
  noPhoto = require('../../assets/image/no-photo.png')
  goPost () {
    this.$router.push({
      path: `/post/${this.article.uid}`
    })
  }
}
</script>
<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
.article-block-comp-ct {
  display: flex;
  align-items: center;
  position: relative;
  min-height: 100px;
  width: 100%;
  margin: 0 0 16px;
  padding: 16px 2px 20px 0;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  text-align: left;
  .content{
    flex: 1;
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
    width: 160px;
    height: 90px;
    overflow: hidden;
    text-align: center;
    .cover{
      width: 100%;
      height: auto;
    }
  }
}
</style>
