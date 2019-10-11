import axios, {AxiosResponse} from 'axios'
import { Message } from 'iview'

const request = axios.create({
  baseURL: '/api'
  // ..
})

request.interceptors.response.use((res: AxiosResponse): any => {
  console.log('拦截器', res.data)
  if (res.data.code === 0) {
    return res.data
  }
  alert(res.data.message)
  // message.error(res.data.message)
  return Promise.reject(res.data.message)
})

interface RequestFn {
  userLogin: any
}

const Requests: any = {
  userLogin(data) {
    return request.post('/user/login', data)
  }
}
export default Requests
