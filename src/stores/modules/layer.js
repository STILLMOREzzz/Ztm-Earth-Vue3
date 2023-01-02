/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-01
 * @Description: 图层数据存储
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-02 12:09
 * @FilePath: ztm-earth-vue3/src/stores/modules/layer.js
 */
import { defineStore } from "pinia";

export const useLayerStore = defineStore("layer", {
  state: () => ({
    layerManagerShow: false,
    baseLayers: [
      {
        name: "tianditu_img",
        text: "天地图影像",
        component: "LayerImagery",
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: "ImageryProviderTianditu",
            props: {
              mapStyle: "img_c",
              token: "d3e838aa7277f50df4ee4b5a1c09c067",
              minimumLevel: 0,
              maximumLevel: 17
            }
          }
        ]
      },
      {
        name: "tianditu_vec",
        text: "天地图街道",
        component: "LayerImagery",
        props: {
          alpha: 1,
          brightness: 1,
          contrast: 1,
          sortOrder: 20,
          show: false
        },
        children: [
          {
            component: "ImageryProviderTianditu",
            props: {
              mapStyle: "vec_c",
              token: "d3e838aa7277f50df4ee4b5a1c09c067",
              minimumLevel: 0,
              maximumLevel: 17
            }
          }
        ]
      }
    ]
  }),
  getters: {},
  actions: {
    changeLayerManagerShow() {
      this.layerManagerShow = !this.layerManagerShow;
    },
    closeLayerManagerShow() {
      this.layerManagerShow = false;
    }
  }
});
