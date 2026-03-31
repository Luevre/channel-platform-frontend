import request from '../utils/request'

// =============================================
// 广告位参数接口
// 放到 src/api/placementParam.js
// =============================================

/** 分页查询广告位参数 */
export const getPlacementParamPage = (params) =>
  request.get('/channel/placement-params', { params })

/** 新增广告位参数 */
export const createPlacementParam = (data) =>
  request.post('/channel/placement-params', data)

/** 编辑广告位参数 */
export const updatePlacementParam = (id, data) =>
  request.put(`/channel/placement-params/${id}`, data)

