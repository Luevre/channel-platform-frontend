import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
})

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      console.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message))
    }
    return res
  },
  error => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    console.error(error.response?.data?.message || '请求失败')
    return Promise.reject(error)
  }
)

export default request