<template>
  <a :style="{width: size, height: size}" class="avatar-comp-ct" :href="`/user/${user.uid}`">
    <img v-if="user.avatar" :src="user.avatar" class="avatar">
    <div v-else :style="{fontSize: width/2 + 'px'}" class="no-avatar">
      <i class="el-icon-user-solid"></i>
    </div>
  </a>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class avatar extends Vue {
  @Prop({ type: Object, default: () => ({}) }) user!: object
  @Prop({ type: Number, default: 48 }) width!:number
  get size () {
    return this.width + 'px'
  }
}
</script>
<style lang="scss" scoped>
.avatar-comp-ct {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  overflow: hidden;
  color: gainsboro;
  border: 0.5px solid;
  font-size: 24px;
  .avatar{
    width: 100%;
    height: 100%;
  }
  .no-avatar{
    text-align: center;
  }
}
</style>
