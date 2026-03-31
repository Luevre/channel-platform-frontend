import request from '../utils/request'

// =============================================
// 回传节点接口
// 放到 src/api/convNode.js
// =============================================

/** 分页查询回传节点 */
export const getConvNodePage = (params) =>
  request.get('/channel/conv-nodes', { params })

/** 查询单个 */
export const getConvNodeById = (id) =>
  request.get(`/channel/conv-nodes/${id}`)

/** 新增 */
export const createConvNode = (data) =>
  request.post('/channel/conv-nodes', data)

/** 编辑 */
export const updateConvNode = (id, data) =>
  request.put(`/channel/conv-nodes/${id}`, data)

/** 删除 */
export const deleteConvNode = (id) =>
  request.delete(`/channel/conv-nodes/${id}`)

/** 归档 */
export const archiveConvNode = (id) =>
  request.put(`/channel/conv-nodes/${id}/archive`)
