import { defineStore } from "pinia";
import { store } from "/@/stores";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    pageLoading: true,
  }),
  getters: {
    getPageLoading() {
      return this.pageLoading;
    },
  },
  actions: {
    setPageLoading(loading) {
      this.pageLoading = loading;
    },
  },
});

// 需要在setup外使用
export function useAppStoreWithOut() {
  return useAppStore(store);
}
