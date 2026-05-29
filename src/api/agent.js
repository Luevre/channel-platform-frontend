import request from '../utils/request'

export const agentChat = (data) =>
  request.post('/agent/chat', data, { timeout: 120000 })
