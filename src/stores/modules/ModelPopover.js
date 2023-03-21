/**
 * @Author: STILLMOREzzz
 * @Date: 2023-03-20
 * @Description: 独立三维建筑模型状态管理
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-03-20 12:51
 * @FilePath: ztm-earth-vue3/src/stores/modules/ModelPopover.js
 */
import { defineStore } from "pinia";
import { getBeiJingList } from "@/api/gridCode";

export const useModelPopoverStore = defineStore("ModelPopover", {
  state: () => ({
    ModelPopoverShow: false,
    beiJingData: []
  }),
  getters: {},
  actions: {
    changeModelPopoverShow() {
      this.ModelPopoverShow = !this.ModelPopoverShow;
    },
    closeModelPopoverShow() {
      this.ModelPopoverShow = false;
    },
    getGridCode() {
      getBeiJingList().then((res) => {
        this.beiJingData = res.data;
      });
    }
  }
});
