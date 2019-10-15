import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
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
  MyMessage({ message: res.data.message, type: 'error' })
  return Promise.reject(res.data.message)
})

request.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = getToken()
  if (token) { config.headers.authorization = token }
  return config
})

type PostFn = (data: object) => AxiosPromise
type GetFn = (params?: object) => AxiosPromise
type PutFn = (uid: string, data: object) => AxiosPromise
interface RequestFns {
  userLogin: PostFn
  userRegister: PostFn
  getUserInfo: GetFn
  getCurrentUserInfo: GetFn
  updateUserInfo: PutFn
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
    return request.get(`http://127.0.0.1:3000/api/user/${params.uid}`)
  },
  updateUserInfo (uid, data) {
    return request.put(`/user/${uid}`, data)
  }
}
export default Requests
