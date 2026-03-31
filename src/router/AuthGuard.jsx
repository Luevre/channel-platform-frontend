import { Navigate } from 'react-router-dom'

// =============================================
// 路由守卫：未登录自动跳转到 /login
// 放到 src/router/AuthGuard.jsx
// =============================================

export default function AuthGuard({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}
