/**
 * @Author: 赵天铭
 * @Date: 2022-12-11
 * @Description: 初始化地球
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-11 18:55
 * @FilePath: ztm-earth-vue3/src/hooks/useInitCesiumMap.js
 */

import useCesium from "@/hooks/useCesium";
import { useAppStoreWithOut } from "@/stores/modules/app";
import nProgress from "nprogress";
import { startLoading, endLoading } from "@/utils/loading";

const Cesium = useCesium();
const appStores = useAppStoreWithOut();

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiN2M3NDk0ZC0yNGE3LTRhY2YtOTczYi0xZDI3Y2QyNmM3YTgiLCJpZCI6MTA5MzksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTc3Mzc2MTR9.fn_I8XG7rubnJfiivYEOVwq3vPluZhvU37EPozFgAYI";

export default function useInitCesiumMap(viewerName = "cesiumContainer") {
  nProgress.start();
  startLoading();
  const viewer = new Cesium.Viewer("cesiumContainer", {
    shadow: true,
    sceneMode: Cesium.SceneMode.SCENE3D,
    projectionPicker: false, //投影方式选择（3D、2D、Columbus）
    navigation: false,
    // terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false, // 显示 信息框
    fullscreenButton: false, // 是否显示全屏按钮
    homeButton: true, // 是否显示首页按钮
    geocoder: false, // 默认不显示搜索栏地址
    sceneModePicker: true, // 是否显示视角切换按钮
    requestRenderMode: true, //启用请求渲染模式
    scene3DOnly: false, //每个几何实例将只能以3D渲染以节省GPU内存
    selectionIndicator: false, // 去掉框选
    showRenderLoopErrors: false,
    baseLayerPicker: false, // 基础影响图层选择器
    navigationHelpButton: false, // 导航帮助按钮
    animation: false, // 动画控件
    timeline: false, // 时间控件
    shadows: false, // 显示阴影
    shouldAnimate: true // 模型动画效果 大气
  });

  window.Viewer = viewer; // 全局挂载方便调试

  viewer._cesiumWidget._creditContainer.style.display = "none"; //去除版权信息
  viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测
  viewer.scene.debugShowFramesPerSecond = true; // 显示 fps

  // 设置查看的默认矩形（当前设置在中国）
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);

  // 页面加载时的缓冲
  const helper = new Cesium.EventHelper();
  helper.add(viewer.scene.globe.tileLoadProgressEvent, (e) => {
    if (e > 20 || e === 0) {
      // console.log('矢量切片加载完成时的回调')
      nProgress.done();
      endLoading();
      appStores.setPageLoading(false);
    } else {
      // console.log('地图资源加载中')
    }
  });
}
