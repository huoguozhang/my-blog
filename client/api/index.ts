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
  if (getToken()) { config.headers.token = getToken() }
  return config
})

type PostFn = (data: object) => AxiosPromise
interface RequestFns {
  userLogin: PostFn
  userRegister: PostFn
}

const Requests: RequestFns = {
  userLogin (data: object) {
    return request.post('/user/login', data)
  },
  userRegister (data: object) {
    return request.post('/user', data)
  }
}
export default Requests
