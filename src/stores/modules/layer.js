/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-01
 * @Description: 图层数据存储
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-05 14:20
 * @FilePath: ztm-earth-vue3/src/stores/modules/layer.js
 */
import { defineStore } from "pinia";
import { toggleCesiumTdtImage, toggleCesiumTerrain } from "@/hooks/useLoadCesiumResources";

// 天地图token
const tdtToken = "d3e838aa7277f50df4ee4b5a1c09c067";

export const useLayerStore = defineStore("layer", {
  state: () => ({
    layerManagerShow: false,
    defaultTree: [0],
    layers: [
      {
        id: -1,
        label: "基础图层",
        children: [
          {
            id: 0,
            label: "天地图影像",
            visible: true,
            layerName: "tdtImgLayer",
            type: "image",
            layerUrl: `http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tdtToken}`
          },
          {
            id: 1,
            label: "天地图影像注记",
            visible: false,
            layerName: "tdtCiaLayer",
            type: "image",
            layerUrl: `http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=${tdtToken}`
          }
        ]
      },
      {
        id: -2,
        label: "地形图层",
        children: [
          {
            id: 2,
            label: "全球地形",
            visible: false,
            layerId: "worldTerrain",
            type: "terrain",
            layerUrl: undefined
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
    },
    /**
     * 通过勾选checkbox来加载或删除cesium数据
     * @param data 所点击的条目数据
     * @param viewer 初始化viewer
     */
    toggleCesiumData(data, viewer) {
      switch (data.type) {
        // 类型为影像
        case "image":
          toggleCesiumTdtImage(data.layerUrl, data.layerName, data.visible, data.id);
          break;
        // 类型为地形
        case "terrain":
          toggleCesiumTerrain(data.visible);
          break;
        default:
          console.log("格式不符合规定！");
      }
    },
    /**
     * 监听图层管理器的开闭，并在每次开闭后重新计算defaultTree的值
     * @param layers 树形数据
     */
    calculateDefaultTree(layers) {
      layers.map((item) => {
        if (item?.visible) {
          this.defaultTree.push(item.id);
        } else {
          if (item.children) {
            this.calculateDefaultTree(item.children);
          }
        }
      });
    }
  }
});
