// template.js you can generate
module.exports = {
  vueTemplate: (componentName) => {
    return `<template>
  <div class="${componentName}-comp-ct">
    ${componentName}组件
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ${componentName} extends Vue {
}
</script>
<style lang="scss" scoped>
.${componentName}-comp-ct {

}
</style>
`
  },
  entryTemplate: (componentName) => {
    return `import ${componentName} from './${componentName}.vue'
    import Vue from 'vue'
    ${componentName}.install = function () {
      Vue.component(${componentName}.name, ${componentName})
    }
export default ${componentName}`
  }
}
