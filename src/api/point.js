/**
 * @Author: 赵天铭
 * @Date: 2022-12-06
 * @Description: 获取点数据
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-06
 * @FilePath: ztm-earth-vue3/src/api/point.js
 */
import request from "@/utils/request";

// 获取城堡图层
export const getChengBaoList = () =>
  request({ url: "/api/getChengBao", method: "get" });
