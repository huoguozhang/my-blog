<template>
  <el-upload :on-success="uploadSuccess" class="upload-comp-ct" :action="action">
    <img v-if="path" class="avatar" :src="path">
    <div v-else class="avatar no-photo">
      <i class="el-icon-user-solid"></i>
    </div>
    <div class="desc">
      {{ path?'修改':'设置' }}头像
    </div>
  </el-upload>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({})
export default class upload extends Vue {
  @Prop({ type: String }) value! :string
  @Watch('value')
  onValueChange (val: string) {
    if (this.path !== val) {
      this.path = val
    }
  }
  path: string = ''
  action: string = '/api/upload'
  uploadSuccess (res: any) {
    if (res.code === 0) {
      this.path = res.data.path
      this.$emit('input', this.path)
    }
  }
  created () {
    this.path = this.value
  }
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
