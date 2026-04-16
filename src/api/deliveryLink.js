import request from '../utils/request'

// 投放链接
export const getDeliveryLinkPage = (params) =>
  request.get('/delivery/links', { params })

export const getDeliveryLinkById = (id) =>
  request.get(`/delivery/links/${id}`)

export const createDeliveryLink = (data) =>
  request.post('/delivery/links', data)

export const updateDeliveryLink = (id, data) =>
  request.put(`/delivery/links/${id}`, data)

export const archiveDeliveryLink = (id) =>
  request.put(`/delivery/links/${id}/archive`)

// 投放内容
export const getContents = () =>
  request.get('/delivery/contents')

export const createContent = (name) =>
  request.post('/delivery/contents', { name })

export const updateContent = (id, name) =>
  request.put(`/delivery/contents/${id}`, { name })

export const deleteContent = (id) =>
  request.delete(`/delivery/contents/${id}`)

// 投放平台
export const getPlatforms = () =>
  request.get('/delivery/platforms')

export const createPlatform = (name) =>
  request.post('/delivery/platforms', { name })

export const updatePlatform = (id, name) =>
  request.put(`/delivery/platforms/${id}`, { name })

export const deletePlatform = (id) =>
  request.delete(`/delivery/platforms/${id}`)

export const createPosition = (platformId, name) =>
  request.post(`/delivery/platforms/${platformId}/positions`, { name })

export const updatePosition = (id, name) =>
  request.put(`/delivery/platforms/positions/${id}`, { name })

export const deletePosition = (id) =>
  request.delete(`/delivery/platforms/positions/${id}`)
