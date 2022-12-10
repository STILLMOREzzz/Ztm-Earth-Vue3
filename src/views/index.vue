<template>
  <div id="cesiumContainer"></div>
</template>

<script>
/**
 * @Author: 赵天铭
 * @Date: 2022-12-10
 * @Description: 初始化地球
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-10 10:31
 * @FilePath: ztm-earth-vue3/src/views/index.vue
 */
import { onMounted, defineComponent } from "vue";
import useCesium from "../hooks/useCesium";

export default defineComponent({
  name: "Cesium",
  setup() {
    initCesiumVisual();
    return {};
  },
});

function initCesiumVisual() {
  onMounted(() => {
    const Cesium = useCesium();
    const viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false, //动画控件
      timeline: false, //时间线
      fullscreenButton: false, // 全屏按钮
      geocoder: false, //地名查找（依赖google服务）
      homeButton: false, //重置到初始焦点与缩放
      selectionIndicator: false, //
      shadow: true,
      sceneMode: Cesium.SceneMode.SCENE3D,
      infoBox: false, //消息框
      sceneModePicker: false, //场景模式选择
      navigationHelpButton: false, //导航帮助按钮
      projectionPicker: false, //投影方式选择（3D、2D、Columbus）
      baseLayerPicker: false,
      shouldAnimate: true,
      navigation: false,
      showRenderLoopErrors: false,
      terrainProvider: Cesium.createWorldTerrain(),
    });

    window.Viewer = viewer; // 全局挂载方便调试
    viewer._cesiumWidget._creditContainer.style.display = "none"; //去除版权信息
    viewer.scene.globe.depthTestAgainstTerrain = true; // 开启深度检测

    // 设置查看的默认矩形（当前设置在中国）
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
      80,
      22,
      130,
      50
    );
  });
}
</script>
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
