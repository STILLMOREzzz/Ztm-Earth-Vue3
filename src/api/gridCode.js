/**
 * @Author: STILLMOREzzz
 * @Date: 2023-03-01
 * @Description: 获取网格
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-03-01
 * @FilePath: ztm-earth-vue3/src/api/gridCode.js
 */
import request from "@/utils/request";

// 获取网格信息
export const getGridCode = (gridCode) =>
  request({ url: "/api/getAllByCode/", method: "post", data: { code: gridCode } });
