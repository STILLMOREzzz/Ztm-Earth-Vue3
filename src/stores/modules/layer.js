/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-01
 * @Description: 图层数据存储
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-03-08 16:32
 * @FilePath: ztm-earth-vue3/src/stores/modules/layer.js
 */
import { defineStore } from "pinia";
import {
  toggleCesiumTdtImage,
  toggleCesiumTerrain,
  toggle3dtiles
} from "@/hooks/useLoadCesiumResources";

// 天地图token
const tdtToken = "d3e838aa7277f50df4ee4b5a1c09c067";

//todo：写一个全局的状态id，在每次添加新的图层时，从某个数开始累加。如何确定类型是image还是3dtiles？
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
            uid: 0,
            layerName: "tdtImgLayer",
            type: "image",
            layerUrl: `http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tdtToken}`
          },
          {
            id: 1,
            label: "天地图影像注记",
            visible: false,
            uid: 1,
            layerName: "tdtCiaLayer",
            type: "image",
            layerUrl: `http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=${tdtToken}`
          }
        ]
      },
      {
        id: -2,
        label: "模型图层",
        children: [
          {
            id: 2,
            label: "北京地区建筑模型",
            visible: false,
            uid: 0,
            layerId: "PekingTilest",
            type: "3dtiles",
            // layerUrl: "http://localhost:9003/model/dX29aUq6/tileset.json"
            layerUrl: "http://localhost:9003/model/uA2wve7p/tileset.json"
          }
        ]
      },
      {
        id: -3,
        label: "地形图层",
        children: [
          {
            id: 3,
            label: "全球地形",
            visible: false,
            uid: 0,
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
     * @param viewer
     */
    toggleCesiumData(data, viewer) {
      switch (data.type) {
        // 类型为影像
        case "image":
          toggleCesiumTdtImage(data.layerUrl, data.layerName, data.visible, data.uid);
          break;
        // 类型为模型
        case "3dtiles":
          toggle3dtiles(data.layerUrl, data.layerName, data.visible, data.uid, viewer);
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
          if (item.children instanceof Array && item.children.length > 0) {
            this.calculateDefaultTree(item.children);
          }
        }
      });
    }
  }
});
