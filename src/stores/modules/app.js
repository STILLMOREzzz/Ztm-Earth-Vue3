import { defineStore } from 'pinia'
import { store } from '/@/stores'


export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    pageLoading: true,
  }),
  getters: {
    getPageLoading() {
      return this.pageLoading
    },
  },
  actions: {
    setPageLoading(loading){
      this.pageLoading = loading
    },
  },
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store)
}
