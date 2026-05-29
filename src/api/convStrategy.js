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

// ========== 审核接口 ==========

/** 待审核列表 */
export const getStrategyReviewList = (params) =>
  request.get('/channel/conv-strategies/review/list', { params })

/** 审核详情 */
export const getStrategyReviewDetail = (id) =>
  request.get(`/channel/conv-strategies/review/${id}`)

/** 审核操作（通过/驳回） */
export const auditStrategy = (id, data) => {
  if (data.auditResult === 1) {
    return request.post(`/channel/conv-strategies/review/${id}/pass`)
  }
  return request.post(`/channel/conv-strategies/review/${id}/reject`, data)
}
