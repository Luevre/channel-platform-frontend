import request from '../utils/request'

export const getMyParameterPage = (params) =>
  request.get('/channel/my-params', { params })

export const getMyParameterById = (id) =>
  request.get(`/channel/my-params/${id}`)

export const createMyParameter = (data) =>
  request.post('/channel/my-params', data)

export const updateMyParameter = (id, data) =>
  request.put(`/channel/my-params/${id}`, data)

export const deleteMyParameter = (id) =>
  request.delete(`/channel/my-params/${id}`)

export const submitMyParameter = (id) =>
  request.post(`/channel/my-params/${id}/submit`)

export const archiveMyParameter = (id) =>
  request.put(`/channel/my-params/${id}/archive`)

export const auditMyParameter = (data) =>
  request.post('/channel/my-params/review/audit', data)

export const getPlacementParamOptions = () =>
  request.get('/channel/my-params/placement-options')