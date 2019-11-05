import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message } from 'element-ui'
import { ElMessageOptions } from 'element-ui/types/message'
import { getToken } from '~/client/utils/token'

const MyMessage = (options: ElMessageOptions) => {
  Message({ ...options, showClose: true, duration: 2000 })
}
const request = axios.create({
  baseURL: '/api'
  // ..
})

request.interceptors.response.use((res: AxiosResponse): any => {
  if (res.data.code === 0) {
    return res.data.data
  }
  if (res.data.code !== 4) {
    MyMessage({ message: res.data.message, type: 'error' })
  }
  return Promise.reject(res.data.message)
}, (e) => {
  MyMessage({ message: e, type: 'error' })
  return Promise.reject(e.response.data.message)
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
type DeleteFn = (uid?: string) => AxiosPromise
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
  createCommentOfArticle: PostFn
  getCommentOfArticle: GetFn
  createUserLikeArticle: PostFn
  getUserLikeArticleStatus: GetFn
  updateUserLikeArticleStatus: PutFn
  createArticleReadRecord: PostFn
  getRecommendUsers: GetFn
  deleteArticleItem: DeleteFn
  updateArticleItem: PutFn
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
  updateArticleItem (uid: string, data: object) {
    return request.put(`/article/${uid}/`, data)
  },
  getArticleItem (uid: string) {
    return request.get(`/article/${uid}/`)
  },
  deleteArticleItem (uid: string) {
    return request.delete(`/article/${uid}/`)
  },
  uploadFile (data: object) {
    return request.post('/upload', data, {
      headers: {
        'content-type': 'multipart/form-data;charset=UTF-8'
      }
    })
  },
  createCommentOfArticle (data: object) {
    return request.post('/comment', data)
  },
  getCommentOfArticle (params: object = {}) {
    return request.get('/comment', { params })
  },
  // 创建一条喜欢或者不喜欢的记录
  createUserLikeArticle (data: object) {
    return request.post('/like', data)
  },
  // 获取用户对文章的喜欢状态
  getUserLikeArticleStatus (params) {
    return request.get('/like/current', { params })
  },
  // 更新用户对文某一篇的喜欢状态
  updateUserLikeArticleStatus (uid: string, data: object) {
    return request.put(`/like/${uid}`, data)
  },
  // 创建一条阅读记录
  createArticleReadRecord (data: object) {
    return request.post('/read/record', data)
  },
  // 获取推荐用户
  getRecommendUsers (params: object = {}) {
    return request.get('/user/recommend', { params })
  }
}
export default Requests
