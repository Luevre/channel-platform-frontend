import request from '../utils/request'

// 我的投放场景
export const getMyDeliveryScenePage = (params) =>
  request.get('/delivery/my-scenes', { params })

export const getMyDeliverySceneById = (id) =>
  request.get(`/delivery/my-scenes/${id}`)

export const createMyDeliveryScene = (data) =>
  request.post('/delivery/my-scenes', data)

export const updateMyDeliveryScene = (id, data) =>
  request.put(`/delivery/my-scenes/${id}`, data)

export const deleteMyDeliveryScene = (id) =>
  request.delete(`/delivery/my-scenes/${id}`)

export const submitMyDeliveryScene = (id) =>
  request.post(`/delivery/my-scenes/${id}/submit`)

export const archiveMyDeliveryScene = (id) =>
  request.put(`/delivery/my-scenes/${id}/archive`)

export const auditMyDeliveryScene = (data) =>
  request.post('/delivery/my-scenes/review/audit', data)
