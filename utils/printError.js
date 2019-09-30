// code data.code后台返回的非0错误码，msg需要展示的，type消息类型
import { Message } from 'element-ui'
function printError (code, who, type) {
  const errorMsgMap = {
    0: '操作成功:',
    1: '未知错误',
    2: '',
    3: '没有权限:',
    4: '登录失效:',
    5: '登录失效:',
    6: '不支持的操作:',
    7: '数据库错误:',
    8: '',
    9: '删除错误:',
    10: '登录失败:',
    11: '许可过期:',
    12: '许可超限:',
    13: '没有学校信息:',
    14: '没有找到资源:',
    257: '天气获取失败:',
    258: '天气区域不存在:',
    301: '文件不存在:',
    302: '升级文件不正确:',
    304: '升级文件没有找到:',
    520: '超限:',
    528: '文本过长'
  }
  const types = new Set(['success', 'warning', 'info', 'error'])
  if (!errorMsgMap.hasOwnProperty(code)) {
    return false
  }
  let msgType = 'error'
  if (type && types.has(type)) {
    msgType = type
  }
  who = who || ''
  Message[msgType](errorMsgMap[code] + who)
  return true
}
export default printError
