/**
 * @Author: STILLMOREzzz
 * @Date: 2023-03-17
 * @Description: 通视分析
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 023-03-17 120:39
 * @FilePath: ztm-earth-vue3/src/hooks/useVisibilityAnalysis.js
 */
import { unref } from "vue";
import useCesium from "@/hooks/useCesium";
const Cesium = useCesium();

/**
 * 根据传入的类型来进行可视域分析或通视分析
 * @param type
 */
// todo: 功能部分与绘制文件（./useDrawFlatObject.js）有重叠，有时间应该重新集成
function useVisibilityAnalysis(type) {
  const activeShapePoints = unref([]);
  let activeShape = unref(null);
  let floatingPoint = unref(null);

  // 开启深度检测
  window.Viewer.scene.globe.depthTestAgainstTerrain = true;
  //双击鼠标左键清除默认事件
  window.Viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
}
