import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 120000,
})

/** 清除登录态并跳转到登录页（防止并发请求多次触发） */
let redirecting = false
function redirectToLogin() {
  if (redirecting) return
  redirecting = true
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  // 短暂延迟确保状态清除后再跳转
  setTimeout(() => {
    window.location.href = '/login'
    redirecting = false
  }, 100)
}

/** 解码 JWT payload（不验签，仅读 exp 字段） */
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // exp 单位是秒，提前 10 秒判定过期，避免边界竞态
    return payload.exp && payload.exp * 1000 - 10_000 < Date.now()
  } catch {
    return false // 解码失败交给后端判断
  }
}

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      // 发请求前主动检查 token 是否已过期，避免无效请求打到后端
      if (isTokenExpired(token)) {
        redirectToLogin()
        return Promise.reject(new Error('Token expired'))
      }
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
      redirectToLogin()
    } else {
      console.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request