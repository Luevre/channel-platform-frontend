import request from '../utils/request'

// 我的回传节点
export const getMyConvNodePage = (params) =>
  request.get('/channel/my-conv-nodes', { params })

export const getMyConvNodeById = (id) =>
  request.get(`/channel/my-conv-nodes/${id}`)

export const createMyConvNode = (data) =>
  request.post('/channel/my-conv-nodes', data)

export const updateMyConvNode = (id, data) =>
  request.put(`/channel/my-conv-nodes/${id}`, data)

export const deleteMyConvNode = (id) =>
  request.delete(`/channel/my-conv-nodes/${id}`)

export const submitMyConvNode = (id) =>
  request.post(`/channel/my-conv-nodes/${id}/submit`)

export const archiveMyConvNode = (id) =>
  request.put(`/channel/my-conv-nodes/${id}/archive`)

export const auditMyConvNode = (data) =>
  request.post('/channel/my-conv-nodes/review/audit', data)
