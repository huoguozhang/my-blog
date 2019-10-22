import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import { Message } from 'element-ui'
import { ElMessageOptions } from 'element-ui/types/message'
import { getToken } from '~/client/utils/token'

const MyMessage = (options: ElMessageOptions) => {
  Message({ ...options, showClose: true, duration: 2000 })
}
const request = axios.create({
  baseURL: 'http://127.0.0.1:3000/api'
  // ..
})

request.interceptors.response.use((res: AxiosResponse): any => {
  if (res.data.code === 0) {
    return res.data.data
  }
  MyMessage({ message: res.data.message, type: 'error' })
  return Promise.reject(res.data.message)
}, () => {
})

request.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = getToken()
  if (token) { config.headers.authorization = token }
  return config
})

type PostFn = (data: object) => AxiosPromise
type GetFn = (params?: object) => AxiosPromise
type GetItemFn = (uid: string) => AxiosPromise
type PutFn = (uid: string, data: object) => AxiosPromise
interface RequestFns {
  userLogin: PostFn
  userRegister: PostFn
  getUserInfo: GetFn
  getCurrentUserInfo: GetFn
  updateUserInfo: PutFn
  createArticle: PostFn
  uploadFile: PostFn
  getArticleList: GetFn
  getUserList: GetFn
  getArticleItem: GetItemFn
}

const Requests: RequestFns = {
  userLogin (data: object) {
    return request.post('/user/login', data)
  },
  userRegister (data: object) {
    return request.post('/user', data)
  },
  getCurrentUserInfo () {
    return request.get('/user/current')
  },
  getUserInfo (params: any) {
    return request.get(`/user/${params.uid}`)
  },
  updateUserInfo (uid, data) {
    return request.put(`/user/${uid}`, data)
  },
  getUserList (params: object = {}) {
    return request.get('/user', { params })
  },
  getArticleList (params : object = {}) {
    return request.get('/article', { params })
  },
  createArticle (data: object) {
    return request.post('/article', data)
  },
  getArticleItem (uid: string) {
    return request.get(`/article/${uid}/`)
  },
  uploadFile (data: object) {
    return request.post('/upload', data, {
      headers: {
        'content-type': 'multipart/form-data;charset=UTF-8'
      }
    })
  }
}
export default Requests
