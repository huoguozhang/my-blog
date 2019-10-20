import marked from 'marked'
import _ from 'lodash'
import hljs from './js/hljs'
import {
  saveFile
} from './js/utils'
import defaultTools from './js/tools'

const renderer = new marked.Renderer()

marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  highlight (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  name: 'markdown',
  model: {
    prop: 'initialValue',
    event: 'change'
  },
  props: {
    uploadImageFile: Function,
    articleTitle: String,
    initialValue: {
      type: String,
      default: ''
    }, // 初始化内容
    theme: { // 默认主题
      type: String,
      default: 'Light'
    },
    width: { // 初始化宽度
      type: [Number, String],
      default: 'auto'
    },
    height: { // 初始化高度
      type: Number,
      default: 600
    }, // 宽度
    toolbars: { // 工具栏
      type: Object,
      default () {
        return {}
      }
    },
    autoSave: { // 是否自动保存
      type: Boolean,
      default: true
    },
    interval: { // 自动保存间隔 mm
      type: Number,
      default: 100000
    },
    exportFileName: { // 默认导出文件名称
      type: String,
      default: '未命名文件'
    },
    markedOptions: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: '', // 输入框内容
      timeoutId: null,
      indexLength: 100,
      title: '',
      html: '',
      preview: 1, // 是否是预览状态
      isFullscreen: true, // 是否是全屏
      scrollHeight: null,
      scroll: 'markdown', // 哪个半栏在滑动
      themeName: '', // 主题名称
      lastInsert: '',
      timerId: null, // 定时器id
      themeSlideDown: false,
      imgs: [],
      scrolling: false, // 同步滚动
      editorHeight: '',
      editorWidth: '',
      previewImgModal: false,
      previewImgSrc: '',
      previewImgMode: ''
    }
  },
  computed: {
    pureHtml () {
      return _.template(this.html)
    },
    tools () {
      const {
        toolbars = {}
      } = this
      return {
        ...defaultTools,
        ...toolbars
      }
    }
  },
  beforeMount () {
    hljs.initHighlightingOnLoad()
  },
  mounted () {
    const textarea = this.$refs.textarea
    this.init()
    setTimeout(() => {
      textarea.focus()
      textarea.addEventListener('keydown', (e) => {
        if (e.keyCode === 83) {
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            this.handleSave()
          }
        }
      })
      textarea.addEventListener('paste', this.handlePaste)
      if (this.autoSave) {
        this.timerId = setInterval(() => {
          this.handleSave()
        }, this.interval)
      }
    }, 20)
    this.initDrag(textarea)
  },
  methods: {
    // 初始化拖拽事件
    initDrag (dropZone) {
      dropZone.addEventListener('dragenter', function (e) {
        e.preventDefault()
        e.stopPropagation()
      }, false)

      dropZone.addEventListener('dragover', function (e) {
        e.dataTransfer.dropEffect = 'copy' // 兼容某些三方应用，如圈点
        // e.preventDefault()
        e.stopPropagation()
      }, false)

      dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault()
        e.stopPropagation()
      }, false)

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        // 处理拖拽文件的逻辑
        this.handleDropFile(e.dataTransfer)
      })
    },
    // 处理拖拽文件
    handleDropFile (df) {
      let dropFiles = [] // 拖拽的文件，会放到这里
      let dealFileCnt = 0 // 读取文件是个异步的过程，需要记录处理了多少个文件了
      let allFileLen = df.files.length // 所有的文件的数量，给非Chrome浏览器使用的变量
      function getDropFileCallBack (dropFiles) {
        console.log(dropFiles, dropFiles.length)
      }
      // 检测是否已经把所有的文件都遍历过了
      function checkDropFinish () {
        if (dealFileCnt === allFileLen - 1) {
          getDropFileCallBack(dropFiles)
        }
        dealFileCnt++
      }

      if (df.items !== undefined) {
        // Chrome拖拽文件逻辑
        for (let i = 0; i < df.items.length; i++) {
          let item = df.items[ i ]
          // 只支持图片
          if (/^image/ig.test(item.type) && item.kind === 'file' && item.webkitGetAsEntry().isFile) {
            let file = item.getAsFile()
            dropFiles.push(file)
            this.handleImageFile(file)
          }
        }
      } else {
        // 非Chrome拖拽文件逻辑
        for (let i = 0; i < allFileLen; i++) {
          let dropFile = df.files[ i ]
          if (dropFile.type) {
            dropFiles.push(dropFile)
            checkDropFinish()
          } else {
            try {
              let fileReader = new FileReader()
              fileReader.readAsDataURL(dropFile.slice(0, 3))

              fileReader.addEventListener('load', function (e) {
                console.log(e, 'load')
                dropFiles.push(dropFile)
                checkDropFinish()
              }, false)
              fileReader.addEventListener('error', function (e) {
                console.log(e, 'error，不可以上传文件夹')
                checkDropFinish()
              }, false)
            } catch (e) {
              console.log(e, 'catch error，不可以上传文件夹')
              checkDropFinish()
            }
          }
        }
      }
    },
    // 拿到的图片文件
    async handleImageFile (file) {
      // 保存起来
      let oldValue = this.$refs.textarea.value
      // 需要保存原来的光标位置
      let prevData = this.insertContent(`[图片上传中...(${file.name})]`)
      const data = await this.uploadImageFile(file)
      this.$refs.textarea.value = oldValue
      this.insertContent(`![${file.name}](${data.path})`, prevData)
      // 上传文件
    },
    init () {
      this.value = this.initialValue
      this.title = this.articleTitle
      this.themeName = this.theme
      this.editorHeight = this.height
      this.editorWidth = this.width
    },
    handlePaste (e) { // 粘贴图片
      const {
        clipboardData = {}
      } = e
      const {
        types = [], items
      } = clipboardData
      let item = null
      for (let i = 0; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }
      if (item) {
        const file = item.getAsFile()
        if (/image/ig.test(file.type)) {
          this.$emit('on-paste-image', file)
          e.preventDefault()
        }
      }
    },
    markdownScroll () {
      const {
        scrolling
      } = this
      if (!scrolling) {
        return
      }
      if (this.scroll === 'markdown') {
        const markdownContent = this.$refs.markdownContent
        const preview = this.$refs.preview
        const markdownScrollHeight = markdownContent.scrollHeight
        const markdownScrollTop = markdownContent.scrollTop
        const previewScrollHeight = preview.scrollHeight
        preview.scrollTop = parseInt(markdownScrollTop / markdownScrollHeight * previewScrollHeight, 0)
      }
    },
    previewScroll () {
      const {
        scrolling
      } = this
      if (!scrolling) {
        return
      }
      if (this.scroll === 'preview') {
        const markdownContent = this.$refs.markdownContent
        const preview = this.$refs.preview
        const markdownScrollHeight = markdownContent.scrollHeight
        const previewScrollHeight = preview.scrollHeight
        const previewScrollTop = preview.scrollTop
        markdownContent.scrollTop = parseInt(previewScrollTop / previewScrollHeight * markdownScrollHeight, 0)
      }
    },
    mousescrollSide (side) { // 设置究竟是哪个半边在主动滑动
      this.scroll = side
    },
    insertContent (initStr, prevData = {}) { // 插入文本
      const {
        preview
      } = this
      if (preview === 2) {
        return
      }
      this.lastInsert = initStr
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      const lastFourCharts = this.value.substring(point - 4, point)
      if (lastChart !== '\n' && this.value !== '' && lastFourCharts !== '    ') {
        const str = '\n' + initStr
        return this.insertAfterText(str, prevData)
      } else {
        return this.insertAfterText(initStr, prevData)
      }
    },
    getCursortPosition () { // 获取光标位置
      const textDom = this.$refs.textarea
      let cursorPos = 0
      if (document.selection) {
        textDom.focus()
        const selectRange = document.selection.createRange()
        selectRange.moveStart('character', -this.value.length)
        cursorPos = selectRange.text.length
      } else if (textDom.selectionStart || parseInt(textDom.selectionStart, 0) === 0) {
        cursorPos = textDom.selectionStart
      }
      return cursorPos
    },
    insertAfterText (value, prevData = {}) { // 插入文本
      const textDom = this.$refs.textarea
      let selectRange
      if (document.selection) {
        textDom.focus()
        selectRange = document.selection.createRange()
        selectRange.text = value
        textDom.focus()
      } else if (textDom.selectionStart || parseInt(textDom.selectionStart, 0) === 0) {
        const startPos = prevData.startPos || textDom.selectionStart
        const endPos = prevData.endPos || textDom.selectionEnd
        const scrollTop = prevData.scrollTop || textDom.scrollTop
        prevData = { startPos, endPos, scrollTop }
        textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length)
        textDom.focus()
        textDom.selectionStart = startPos + value.length
        textDom.selectionEnd = startPos + value.length
        textDom.scrollTop = scrollTop
      } else {
        textDom.value += value
        textDom.focus()
      }
      this.$set(this, 'value', textDom.value)
      return prevData
    },
    setCaretPosition (position) { // 设置光标位置
      const textDom = this.$refs.textarea
      if (textDom.setSelectionRange) {
        textDom.focus()
        textDom.setSelectionRange(position, position)
      } else if (textDom.createTextRange) {
        const range = textDom.createTextRange()
        range.collapse(true)
        range.moveEnd('character', position)
        range.moveStart('character', position)
        range.select()
      }
    },
    insertQuote () { // 引用
      this.insertContent('\n>  ')
    },
    insertUl () { // 无需列表
      this.insertContent('-  ')
    },
    insertOl () { // 有序列表
      this.insertContent('1. ')
    },
    insertFinished () { // 已完成列表
      this.insertContent('- [x]  ')
    },
    insertNotFinished () { // 未完成列表
      this.insertContent('- [ ]  ')
    },
    insertLink () { // 插入链接
      this.insertContent('\n[插入链接](href)')
    },
    insertImage () { // 插入图片
      this.insertContent('\n![image](imgUrl)')
    },
    insertTable () { // 插入表格
      this.insertContent('\nheader 1 | header 2\n---|---\nrow 1 col 1 | row 1 col 2\nrow 2 col 1 | row 2 col 2\n\n')
    },
    insertCode () { // 插入code
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('\n```\n\n```')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 5)
      } else {
        this.setCaretPosition(point + 5)
      }
    },
    insertStrong () { // 粗体
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('****')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 2)
      } else {
        this.setCaretPosition(point + 2)
      }
    },
    insertItalic () { // 斜体
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('**')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 1)
      } else {
        this.setCaretPosition(point + 1)
      }
    },
    insertBg () { // 背景色
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('====')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 5)
      } else {
        this.setCaretPosition(point + 5)
      }
    },
    insertUnderline () { // 下划线
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('<u></u>')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 3)
      } else {
        this.setCaretPosition(point + 5)
      }
    },
    insertOverline () { // overline
      const point = this.getCursortPosition()
      const lastChart = this.value.substring(point - 1, point)
      this.insertContent('~~~~')
      if (lastChart !== '\n' && this.value !== '') {
        this.setCaretPosition(point + 2)
      } else {
        this.setCaretPosition(point + 2)
      }
    },
    insertTitle (level) { // 插入标题
      const titleLevel = {
        1: '#  ',
        2: '##  ',
        3: '###  ',
        4: '####  ',
        5: '#####  ',
        6: '######  '
      }
      this.insertContent(titleLevel[level])
    },
    tab (e) { // 屏蔽teatarea tab默认事件
      this.insertContent('    ', this)
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
    },
    handleSave () { // 保存操作
      const {
        value,
        html,
        themeName
      } = this
      this.$emit('on-save', {
        theme: themeName,
        value,
        html
      })
    },
    insertLine () { // 插入分割线
      this.insertContent('\n----\n')
    },
    toggleSlideDown () { // 显示主题选项
      this.slideDown = !this.slideDown
    },
    setThemes (name) { // 设置主题
      this.themeName = name
      this.themeSlideDown = false
    },
    enter () { // 回车事件
      const {
        lastInsert
      } = this
      const list = ['-  ', '1. ', '- [ ]  ', '- [x]  ']
      if (list.includes(lastInsert)) {
        this.insertContent(lastInsert)
      }
    },
    onDelete () { // 删除时,以回车为界分割，如果数组最后一个元素为''时，将行一次插入的共嗯那个置为空，避免回车时再次插入
      const lines = this.value.split('\n')
      if (lines[lines.length - 1] === '') {
        this.lastInsert = ''
      }
    },
    exportMd () { // 导出为.md格式
      saveFile(this.value, this.exportFileName + '.md')
    },
    importFile (e) { // 导入本地文件
      const file = e.target.files[0]
      if (!file) {
        return
      }
      const {
        type
      } = file
      if (type !== 'text/markdown') {
        this.$Notice.error('文件格式有误!')
        return
      }
      const reader = new FileReader()
      reader.readAsText(file, {
        encoding: 'utf-8'
      })
      reader.onload = () => {
        this.value = reader.result
        e.target.value = ''
      }
    },
    addImageClickListener () { // 监听查看大图
      const {
        imgs
      } = this
      if (imgs.length > 0) {
        for (let i = 0, len = imgs.length; i < len; i++) {
          imgs[i].onclick = null
        }
      }
      setTimeout(() => {
        this.imgs = this.$refs.preview.querySelectorAll('img')
        for (let i = 0, len = this.imgs.length; i < len; i++) {
          this.imgs[i].onclick = () => {
            const src = this.imgs[i].getAttribute('src')
            this.previewImage(src)
          }
        }
      }, 600)
    },
    previewImage (src) { // 预览图片
      const img = new Image()
      img.src = src
      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight
        if ((height / width) > 1.4) {
          this.previewImgMode = 'horizontal'
        } else {
          this.previewImgMode = 'vertical'
        }
        this.previewImgSrc = src
        this.previewImgModal = true
      }
    }
  },
  watch: {
    initialValue () {
      this.value = this.initialValue
    },
    value (val) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.html = marked(this.value, {
          breaks: true,
          sanitize: false,
          ...this.markedOptions
        })
      }, 30)
      this.indexLength = this.value.split('\n').length
      const height1 = this.indexLength * 22
      const height2 = this.$refs.textarea.scrollHeight
      const height3 = this.$refs.preview.scrollHeight
      this.scrollHeight = Math.max(height1, height2, height3)
      this.indexLength = parseInt(this.scrollHeight / 22, 0) - 1
      this.addImageClickListener()
      if (val !== this.initialValue) {
        this.$emit('change', val)
      }
    },
    theme () {
      this.themeName = this.theme
    },
    height () {
      this.editorHeight = this.height
    },
    width () {
      this.editorWidth = this.width
    },
    articleTitle (val) {
      if (val !== this.title) {
        this.title = val
      }
    },
    title (val) {
      if (val !== this.articleTitle) {
        this.$emit('update:articleTitle', val)
      }
    }
  },
  destroyed () { // 销毁时清除定时器
    clearInterval(this.timerId)
  }
}
