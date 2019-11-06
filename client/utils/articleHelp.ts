function wordCount (content: string): number {
  return content.replace(/[\s\r\n]+/g, '').length
}

function getSummary (html: string, len:number = 160): string {
  const copyNode = document.createElement('div')
  copyNode.innerHTML = html
  const codes = copyNode.querySelectorAll('code')
  codes.forEach((c) => {
    html = html.replace(c.innerHTML, '')
  })
  copyNode.innerHTML = html
  return copyNode.textContent!.substring(0, len)
}

export {
  wordCount,
  getSummary
}
