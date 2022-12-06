<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import { onMounted, onUnmounted, defineComponent } from 'vue'
import * as Cesium from 'cesium'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NzNiMDhkOS0wMWVkLTQ1MDYtOTE5Zi1iNjVmNzU1YzdlYzEiLCJpZCI6MTIxODIsImlhdCI6MTYzNDgyMTQwNX0.KS4Fov-Kdyfr7lxby8WHSUoYipl2XK5zhf204iwQJNE'

export default defineComponent({
  name: 'cesium',
  setup() {
    initCesiumVisual()
    onUnmounted(() => {

    })
    return {}
  },
})
function initCesiumVisual() {
  onMounted(() => {
    // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
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
    })
    //去除版权信息
    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.scene.globe.depthTestAgainstTerrain = true; //解决地形遮挡entity问题


  })
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