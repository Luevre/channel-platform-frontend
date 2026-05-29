import request from '../utils/request'

/** 待审核列表 */
export const getConvStrategyReviewPage = (params) =>
  request.get('/channel/conv-strategies/review/list', { params })

/** 审核详情 */
export const getConvStrategyReviewById = (id) =>
  request.get(`/channel/conv-strategies/review/${id}`)

/** 审核通过 */
export const passConvStrategyReview = (id) =>
  request.post(`/channel/conv-strategies/review/${id}/pass`)

/** 审核驳回 */
export const rejectConvStrategyReview = (id, data) =>
  request.post(`/channel/conv-strategies/review/${id}/reject`, data)
