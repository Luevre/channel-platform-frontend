import request from '../utils/request'

export const getPlacementParamPage = (params) =>
  request.get('/channel/placement-params', { params })

export const getPlacementParamById = (id) =>
  request.get(`/channel/placement-params/${id}`)

export const createPlacementParam = (data) =>
  request.post('/channel/placement-params', data)

export const updatePlacementParam = (id, data) =>
  request.put(`/channel/placement-params/${id}`, data)

export const deletePlacementParam = (id) =>
  request.delete(`/channel/placement-params/${id}`)
export const auditPlacementParam = (data) =>
  request.post('/channel/placement-params/audit', data)
