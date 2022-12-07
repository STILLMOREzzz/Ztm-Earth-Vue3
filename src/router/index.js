import { createRouter, createWebHashHistory } from "vue-router";
import Visual from "@/views/visual/index.vue";

const routerHistory = createWebHashHistory(import.meta.env.BASE_URL);
// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由

export const constantRoutes = [
  {
    path: "/",
    name: "home",
    redirect: "/visual",
    children: [
      {
        path: "/visual",
        name: "visual",
        component: Visual,
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
