/**
 * @Author: STILLMOREzzz
 * @Date: 2022-12-11
 * @Description: 用于加载资源时的全屏loading
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2022-12-11 18:49
 * @FilePath: ztm-earth-vue3/src/utils/loading.js
 */

import { ElLoading } from "element-plus";
import "element-plus/theme-chalk/el-loading.css";

let loadingInstance;
const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: "Loading……",
    background: "rgba(122, 122, 122, 0.8)"
  });
};

function endLoading() {
  loadingInstance.close();
}

export { startLoading, endLoading };
