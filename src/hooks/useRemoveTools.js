/**
 * @Author: STILLMOREzzz
 * @Date: 2022-12-10
 * @Description: 绘制平面对象
 * @LastEditors: STILLMOREzzz
 * @LastEditTime: 2022-12-10 10:45
 * @FilePath: ztm-earth-vue3/src/hooks/useRemoveTools.js
 */

import useCesium from "@/hooks/useCesium";
const Cesium = useCesium();

export default function useRemoveTools() {
  /**
   * 清除测量数据
   * @param viewer 3d地图实例
   * @param handler 事件处理器
   * @param arrayEntities 删除实体
   */
  const removeEntities = (viewer, arrayEntities) => {
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    if (handler) {
      handler.destroy();
      handler = null;
    }
    if (arrayEntities && Array.isArray(arrayEntities)) {
      for (let i = 0; i < arrayEntities.length; i++) {
        viewer.entities.remove(arrayEntities[i]);
      }
    }
  };
  /**
   * 删除primitives实体
   * @param viewer 3d地图实例
   */
  const removePrimitives = (viewer) => {
    viewer.scene.primitives.removeAll();
  };

  /**
   * 删除所有实体
   * @param viewer 3d地图实例
   * @param deleteType
   */
  const removeAllDraw = (viewer, deleteType = ["点", "线", "面"]) => {
    // viewer.entities.removeAll()
    const drawEntities = viewer.entities._entities._array;
    const length = drawEntities.length;
    // 倒叙遍历防止实体减少之后 不存在
    for (let f = length - 1; f >= 0; f--) {
      if (drawEntities[f]._name && deleteType.includes(drawEntities[f]._name)) {
        viewer.entities.remove(drawEntities[f]);
      }
    }
  };
  return {
    removeEntities,
    removePrimitives,
    removeAllDraw
  };
}
