/**
 * @Author: 赵天铭
 * @Date: 2022-12-09
 * @Description: cesium的hooks
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-09 21:39
 * @FilePath: ztm-earth-vue3/src/hooks/useCesium.js
 */

import * as Cesium from "cesium";

export default function useCesium() {
  return { ...Cesium };
}
