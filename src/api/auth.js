import request from '../utils/request'

// =============================================
// 认证接口
// 放到 src/api/auth.js
// =============================================

/** 登录 */
export const login = (data) =>
  request.post('/auth/login', data)

/** 退出 */
export const logout = () =>
  request.post('/auth/logout')
