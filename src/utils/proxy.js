/**
 * @Author: STILLMOREzzz
 * @Date: 2022-12-08
 * @Description: 用来解决跨域问题
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2022-12-07
 * @FilePath: ztm-earth-vue3/src/utils/proxy.js
 */
import { API_BASE_URL, API_TARGET_URL, MOCK_API_BASE_URL, MOCK_API_TARGET_URL } from "./constant";

const init = {
  [API_BASE_URL]: {
    target: API_TARGET_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), "")
  }
  // mock
  // [MOCK_API_BASE_URL]: {
  //   target: MOCK_API_TARGET_URL,
  //   changeOrigin: true,
  //   rewrite: (path) => path.replace(new RegExp(`^${MOCK_API_BASE_URL}`), '/api'),
  // },
};

export default init;
