/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-01
 * @Description: 图层数据存储
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-04 21:23
 * @FilePath: ztm-earth-vue3/src/stores/modules/layer.js
 */
import { defineStore } from "pinia";
import { toggleCesiumTdtImage, toggleCesiumTerrain } from "@/hooks/useLoadCesiumResources";

/**
 * 根据属性值来递归查找树形结构中的数据
 * @param id 属性
 * @param list 树形结构数据
 * @returns {null|*}
 */
function findItemById(id, list) {
  let res = list.find((item) => item.id == id);
  if (res) {
    return res;
  } else {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children instanceof Array && list[i].children.length > 0) {
        res = findItemById(id, list[i].children);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }
}
// 天地图token
const tdtToken = "d3e838aa7277f50df4ee4b5a1c09c067";

export const useLayerStore = defineStore("layer", {
  state: () => ({
    layerManagerShow: false,
    defaultTree: [3],
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
    }
  }
});
