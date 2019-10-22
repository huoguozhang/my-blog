<template lang="html">
  <div
    ref="markdown"
    :class="isFullscreen?'markdown fullscreen':'markdown' "
  >
    <!-- 编辑器 -->
    <div class="markdown-content" :style="{background:preview==2?'#fff':''}">
      <div
        v-show="preview===1||preview===3"
        ref="markdownContent"
        class="markdown-editor"
        @scroll="markdownScroll"
        @mouseenter="mousescrollSide('markdown')"
      >
        <!--<ul class="index" ref="index" :style="{height:scrollHeight?`${scrollHeight}px`:'100%'}">
          <li v-for="(item,index) in indexLenth" :key="index">{{index+1}}</li>
        </ul>-->
        <div class="fixed-header">
          <div class="title-ct">
            <input v-model="title" type="text" placeholder="文章标题">
          </div>
          <!-- 头部工具栏 -->
          <ul class="markdown-toolbars">
            <li><slot name="title" /></li>
            <li v-if="tools.strong" name="粗体">
              <span class="iconfont icon-strong" @click="insertStrong" />
            </li>
            <li v-if="tools.italic" name="斜体">
              <span class="iconfont icon-italic" @click="insertItalic" />
            </li>
            <li v-if="tools.overline" name="删除线">
              <span class="iconfont icon-overline" @click="insertOverline" />
            </li>
            <li v-if="tools.h1" name="标题1">
              <span style="font-size: 16px;" @click="insertTitle(1)">h1</span>
            </li>
            <li v-if="tools.h2" name="标题2">
              <span style="font-size: 16px;" @click="insertTitle(2)">h2</span>
            </li>
            <li v-if="tools.h3" name="标题3">
              <span style="font-size: 16px;" @click="insertTitle(3)">h3</span>
            </li>
            <li v-if="tools.h4" name="标题4">
              <span style="font-size: 16px;" @click="insertTitle(4)">h4</span>
            </li>
            <li v-if="tools.h5" name="标题5">
              <span style="font-size: 16px;" @click="insertTitle(5)">h5</span>
            </li>
            <li v-if="tools.h6" name="标题6">
              <span style="font-size: 16px;" @click="insertTitle(6)">h6</span>
            </li>
            <li v-if="tools.hr" name="分割线">
              <span class="iconfont icon-horizontal" @click="insertLine" />
            </li>
            <li v-if="tools.quote" name="引用">
              <span style="font-size: 16px;" class="iconfont icon-quote" @click="insertQuote" />
            </li>
            <li v-if="tools.ul" name="无序列表">
              <span class="iconfont icon-ul" @click="insertUl" />
            </li>
            <li v-if="tools.ol" name="有序列表">
              <span class="iconfont icon-ol" @click="insertOl" />
            </li>
            <li v-if="tools.code" name="代码块">
              <span class="iconfont icon-code" @click="insertCode" />
            </li>
            <li v-if="tools.notChecked" name="未完成列表">
              <span class="iconfont icon-checked-false" @click="insertNotFinished" />
            </li>
            <li v-if="tools.checked" name="已完成列表">
              <span class="iconfont icon-checked" @click="insertFinished" />
            </li>
            <li v-if="tools.link" name="链接">
              <span class="iconfont icon-link" @click="insertLink" />
            </li>
            <li v-if="tools.image" name="图片">
              <span class="iconfont icon-img" @click="insertImage" />
            </li>
            <li v-if="tools.table" name="表格">
              <span class="iconfont icon-table" @click="insertTable" />
            </li>
            <li v-if="tools.print" name="打印">
              <span class="iconfont icon-dayin" @click="print" />
            </li>
            <li v-if="tools.theme" class="shift-theme" name="代码块主题">
              <div>
                <span class="iconfont icon-yanse" @click="themeSlideDown=!themeSlideDown" />
                <ul :class="{active:themeSlideDown}" @mouseleave="themeSlideDown=false">
                  <li @click="setThemes('Light')">
                    Light
                  </li>
                  <li @click="setThemes('Dark')">
                    VS Code
                  </li>
                  <li @click="setThemes('OneDark')">
                    Atom OneDark
                  </li>
                  <li @click="setThemes('GitHub')">
                    GitHub
                  </li>
                </ul>
              </div>
            </li>
            <li v-show="tools.importmd" name="导入本地文件" class="import-file">
              <span class="iconfont icon-daoru" @click="importFile" />
              <input type="file" accept="text/markdown" @change="importFile($event)">
            </li>
            <li v-show="tools.exportmd" name="保存到本地">
              <span class="iconfont icon-download" @click="exportMd" />
            </li>
            <li v-if="tools.shift&&preview==2" name="全屏编辑">
              <span class="iconfont icon-md" @click="preview=3" />
            </li>
            <li v-if="tools.shift&&preview==3" name="分屏显示">
              <span class="iconfont icon-group" @click="preview=1" />
            </li>
            <!--<li v-if="tools.shift&&preview==1" name="预览">
        <span @click="preview=2" class="iconfont icon-preview"></span>
      </li>-->
            <!-- <li :name="scrolling?'同步滚动:开':'同步滚动:关'">
        <span @click="scrolling=!scrolling" v-show="scrolling"  class="iconfont icon-on"></span>
        <span @click="scrolling=!scrolling" v-show="!scrolling" class="iconfont icon-off"></span>
      </li>-->
            <li class="right-slot-ct" style="margin-right: 24px;float: right;">
              <slot name="header-right" />
            </li>
            <li class="empty" />
            <!--<li v-if="tools.fullscreen&&!isFullscreen" name="全屏">
        <span @click="isFullscreen=!isFullscreen" class="iconfont icon-full-screen"></span>
      </li>-->
            <!--<li v-if="tools.fullscreen&&isFullscreen" name="退出全屏">
        <span @click="isFullscreen=!isFullscreen" class="iconfont icon-exit-full-screen"></span>
      </li>-->
          </ul>
        </div>
        <div class="textarea-ct">
          <textarea
            ref="textarea"
            v-model="value"
            placeholder="正文：目前只支持markdown"
            @keydown.tab="tab"
            @keyup.enter="enter"
            @keyup.delete="onDelete"
          />
        </div>
      </div>
      <!--<div v-show="preview==1" class="empty" style="width:2px;"></div>-->
      <div
        v-show="preview===1||preview===2"
        ref="preview"
        :class="`markdown-preview Dark`"
        @scroll="previewScroll"
        @mouseenter="mousescrollSide('preview')"
      >
        <h1 class="title">
          {{ title }}
        </h1>
        <div
          ref="previewInner"
          v-html="html"
        />
      </div>
    </div>
    <!--    预览图片-->
    <div :class="['preview-img',previewImgModal?'active':'']">
      <span class="close" @click="previewImgModal=false">关闭</span>
      <img :src="previewImgSrc" :class="[previewImgMode]" alt="">
    </div>
  </div>
</template>

<script>
import markdown from './markdown'
export default markdown
</script>
<style>
  @import "./font/iconfont.css";
</style>
<style lang="less">
  @import "./css/theme";
  @import "./css/dark";
  @import "./css/index";
</style>
