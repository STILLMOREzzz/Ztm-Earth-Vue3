/**
 * @Author: 赵天铭
 * @Date: 2022-12-06
 * @Description: router配置
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-10 10:21
 * @FilePath: ztm-earth-vue3/src/router/index.js
 */

import { createRouter, createWebHashHistory } from "vue-router";
import Visual from "@/views/index.vue";

const routerHistory = createWebHashHistory(import.meta.env.BASE_URL);
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由

export const constantRoutes = [
  {
    path: "/",
    redirect: "/visual",
  },
  {
    path: "/visual",
    component: Visual,
    children: [
      {
        path: "/point",
        component: () => import("@/components/"),
      },
    ],
  },
];

const router = createRouter({
  history: routerHistory,
  routes: constantRoutes,
});

// 删除/重置路由
export function resetRoute() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export function setupRouter(app) {
  app.use(router);
}

export default router;
