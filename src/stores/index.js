/**
 * @Author: STILLMOREzzz
 * @Date: 2022-12-06
 * @Description: pinia配置
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2022-12-06
 * @FilePath: ztm-earth-vue3/src/stores/index.js
 */
import { createPinia } from "pinia";

const store = createPinia();

export function setupStore(app) {
  app.use(store);
}

export { store };
