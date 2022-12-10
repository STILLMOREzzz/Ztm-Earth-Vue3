/**
 * @Author: 赵天铭
 * @Date: 2022-12-09
 * @Description: cesium的hooks
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-09 21:39
 * @FilePath: ztm-earth-vue3/src/hooks/useCesium.js
 */

import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiN2M3NDk0ZC0yNGE3LTRhY2YtOTczYi0xZDI3Y2QyNmM3YTgiLCJpZCI6MTA5MzksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTc3Mzc2MTR9.fn_I8XG7rubnJfiivYEOVwq3vPluZhvU37EPozFgAYI";

export default function useCesium() {
  return { ...Cesium };
}
