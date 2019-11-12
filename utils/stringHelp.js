const marked = require('marked')

function transferMDtoHtml (mdString) {
  return marked(mdString)
}
function extractTextFormMD (mdString, length = 160) {
  const html = transferMDtoHtml(mdString)
  return html.replace(/<[^>]+>/g, '').replace(/(\s+)|(\n)/g, '').substring(0, length)
}
module.exports = { extractTextFormMD }
