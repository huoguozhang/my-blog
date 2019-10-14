<template>
  <Upload class="upload-comp-ct" :action="action">
    <img v-if="path" class="avatar" src="../assets/image/photo.jpeg">
    <div v-else class="avatar no-photo">
      <Icon type="ios-person" />
    </div>
    <div class="desc">
      点击{{ path?'修改':'设置' }}头像
    </div>
  </Upload>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Upload, Icon } from 'element-ui'
@Component({
  props: {
    value: {
      type: String
    },
    action: {
      type: String,
      default: ''
    }
  },
  components: {
    Upload, Icon
  }
})
export default class upload extends Vue {
  path: string = ''
}
</script>
<style lang="scss" scoped>
  .upload-comp-ct{
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    .avatar{
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border-radius: 50%;
      overflow: hidden;
    }
    .no-photo{
      background: rgb(204, 204, 204);
      font-size: 64px;
    }
    .desc{
      position: absolute;
      left: 0;
      top: 30px;
      width: 80px;
      height: 20px;
      line-height: 20px;
      background-color: rgba(0,0,0,0.3);
      text-align: center;
      color: #fff;
    }
  }
</style>
