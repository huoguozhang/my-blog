function wordCount (content: string): number {
  const cn = (content.match(/[\u4E00-\u9FA5]/g) || []).length
  const en = (content.replace(/[\u4E00-\u9FA5]/g, '').match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g) || []).length
  return cn + en
}

function getSummary (html: string, len:number = 160): string {
  const copyNode = document.createElement('div')
  copyNode.innerHTML = html
  const codes = copyNode.querySelectorAll('code')
  codes.forEach(c => {
    html = html.replace(c.innerHTML, '')
  })
  copyNode.innerHTML = html
  return copyNode.innerText.substring(0, 160)
}

export {
  wordCount,
  getSummary
}
