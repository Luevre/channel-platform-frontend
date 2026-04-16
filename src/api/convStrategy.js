import request from '../utils/request'

/** 分页查询回传策略 */
export const getConvStrategyPage = (params) =>
  request.get('/channel/conv-strategies', { params })

/** 查询单个（含节点列表） */
export const getConvStrategyById = (id) =>
  request.get(`/channel/conv-strategies/${id}`)

/** 新增 */
export const createConvStrategy = (data) =>
  request.post('/channel/conv-strategies', data)

/** 编辑 */
export const updateConvStrategy = (id, data) =>
  request.put(`/channel/conv-strategies/${id}`, data)

/** 归档 */
export const archiveConvStrategy = (id) =>
  request.put(`/channel/conv-strategies/${id}/archive`)

/** 删除 */
export const deleteConvStrategy = (id) =>
  request.delete(`/channel/conv-strategies/${id}`)
