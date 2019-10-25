<template>
  <div class="avatar-comp-ct cursor-p">
    <img v-if="user.avatar" :src="user.avatar" class="avatar">
    <div class="avatar">
      <i class="el-icon-user-solid"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class avatar extends Vue {
  @Prop({ type: Object, default: () => ({}) }) user!: object
}
</script>
<style lang="scss" scoped>
.avatar-comp-ct {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  color: gainsboro;
  border: 0.5px solid;
  font-size: 24px;
  .avatar{
    width: 100%;
    height: 100%;
    line-height: 48px;
    text-align: center;
  }
}
</style>
