/**
 * @Author: STILLMOREzzz
 * @Date: 2023-01-04
 * @Description: 用于加载cesium资源
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2023-01-04 21:23
 * @FilePath: ztm-earth-vue3/src/hooks/useLoadCesiumResources.js
 */
import useCesium from "@/hooks/useCesium";

const Cesium = useCesium();

const tdtSubdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];

/**
 * 加载天地图影像数据
 * @param url 服务地址 str
 * @param layerName 图层名 str
 * @param visual 图层显隐 boolean
 * @param id 图层的id
 */
// todo：现在的问题是，给予imagelayer的index必须是连贯的，不能大于所拥有的数量，导致layer.js中图层的id必须有顺序的编写。主文件夹的id只能为负数，或者很大的数 --2023.01.04
function toggleCesiumTdtImage(url, layerName, visual, id) {
  if (visual) {
    window.Viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: url,
        subdomains: tdtSubdomains,
        layer: layerName,
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: true
      }),
      id
    );
  } else {
    layerName === "tdtImgLayer"
      ? (window.Viewer.imageryLayers.get(0).show = false)
      : (window.Viewer.imageryLayers.get(id).show = false);
  }
}

/**
 * 加载cesium官方地形数据
 * @param visual 图层显隐 boolean
 */
function toggleCesiumTerrain(visual) {
  // 添加全球地形
  if (visual) {
    window.Viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(3956),
      requestWaterMask: true, // 请求水体效果所需要的海岸线数据
      requestVertexNormals: true // 请求地形照明数据
    });
  } else {
    window.Viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
  }
}

export { toggleCesiumTdtImage, toggleCesiumTerrain };
