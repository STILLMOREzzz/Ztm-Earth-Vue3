/**
 * @Author: 赵天铭
 * @Date: 2022-12-15
 * @Description: 导航控件
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-15 20:56
 * @FilePath: ztm-earth-vue3/src/hooks/useNavigation.js
 */

import useCesium from "@/hooks/useCesium";
import CesiumNavigation from "cesium-navigation-es6";
import "cesium/Build/Cesium/Widgets/widgets.css";

const Cesium = useCesium();

export default function useNavigation(viewer) {
  const options = {};
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  // options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50)
  // options.defaultResetView = new Cesium.Cartographic(
  //   Cesium.Math.toRadians(111.50623801848565),
  //   Cesium.Math.toRadians(2.8997206760441205),
  //   8213979.400955964
  // );
  //相机方向
  // options.orientation = {
  //   heading: Cesium.Math.toRadians(350.94452087411315),
  //   pitch: Cesium.Math.toRadians(-66.6402342251215),
  //   roll: Cesium.Math.toRadians(360)
  // };
  //相机延时
  options.duration = 4; //默认为3s

  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = true;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = true;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;

  //修改重置视图的tooltip
  options.resetTooltip = "重置视图";
  //修改放大按钮的tooltip
  options.zoomInTooltip = "放大";
  //修改缩小按钮的tooltip
  options.zoomOutTooltip = "缩小";

  //如需自定义罗盘控件，请看下面的自定义罗盘控件
  return new CesiumNavigation(viewer, options);
}
