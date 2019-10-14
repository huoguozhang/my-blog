<template>
  <el-upload class="upload-comp-ct" :action="action">
    <img v-if="path" class="avatar" src="../assets/image/photo.jpeg">
    <div v-else class="avatar no-photo">
      <i class="el-icon-user-solid"></i>
    </div>
    <div class="desc">
      点击{{ path?'修改':'设置' }}头像
    </div>
  </el-upload>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  props: {
    value: {
      type: String
    },
    action: {
      type: String,
      default: ''
    }
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
