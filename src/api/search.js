import request from '../utils/request';

/**
 * 全局搜索：同时搜索投放参数 / 回传策略 / 投放链接 / 回传节点
 * @param {string} keyword
 */
export const searchAll = (keyword) =>
  request.get('/search', { params: { keyword } });
