import request from '@/utils/request'

// 获取城堡图层
export const getChengBaoList = () => request({url:'/api/getChengBao',method:'get'})
