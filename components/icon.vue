<template>
  <span class="icon-comp-ct">
    <svg class="icon" aria-hidden="true" :style="{color}">
      <use :xlink:href="'#icon-'+icon"></use>
    </svg>
  </span>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'icon',
  props: {
    icon: String,
    color: String
  }
})
export default class icon extends Vue {
}
</script>
<style lang="scss" scoped>
  .icon-comp-ct{
  }
</style>
