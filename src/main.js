/**
 * @Author: 赵天铭
 * @Date: 2022-12-08
 * @Description: vue配置
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-08 21:32
 * @FilePath: ztm-earth-vue3/src/main.js
 */
import { createApp } from "vue";

import App from "./App.vue";
import router, { setupRouter } from "@/router"; // 路由

import { setupDirective } from "@/utils/directive";
import { setupGlobalCom } from "@/components";
import { setupStore } from "@/stores";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "@/assets/styles/index.less";
import mitt from "mitt"; // eventBus

const app = createApp(App);

setupRouter(app); // 引入路由

setupDirective(app); // 注册全局指令

setupGlobalCom(app); // 注册全局公用组件

setupStore(app); // 注册pinia

app.config.globalProperties.mittBus = mitt();
app.use(ElementPlus, { size: "small", zIndex: 3000 });
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  // 注册所有icon图标
  app.component(key, component);
}

router.isReady().then(() => {
  app.mount("#app");
});
