<template>
  <div class="infiniteScroll-comp-ct" :class="`anchor${id}`">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import _ from 'lodash'
let num = 0
@Component
export default class infiniteScroll extends Vue {
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Number, default: 200 }) delay!: number
  @Prop({ type: Number, default: 0 }) distance!: number
  @Prop({ type: Boolean, default: true }) immediate!: boolean
  @Prop({ type: Function, isRequired: true }) loadData!: Function
  id = ++num
  anchor = null
  top:number = 0
  windowHeight: number = 0
  created () {
    if (this.immediate) {
      this.loadData()
    }
  }
  mounted () {
    this.anchor = document.querySelector(`.anchor${this.id}`)
    window.addEventListener('scroll', _.throttle(this.handleScroll, this.delay))
    this.windowHeight = window.innerHeight
  }
  handleScroll () {
    if (this.disabled) { return false }
    this.top = this.anchor.getBoundingClientRect().top
    if (this.top - this.distance <= this.windowHeight + window.screenTop) {
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
.infiniteScroll-comp-ct {
  height: 60px;
  line-height: 60px;
  text-align: center;
}
</style>
