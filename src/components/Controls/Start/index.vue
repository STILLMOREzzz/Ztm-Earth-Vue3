<template>
  <div class="controls-template">
    <div class="controls-list" ref="container">
      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.control }}</span>
        <div class="list-item-btnbox" @click="navigationShow = !navigationShow">
          <div
            class="list-item-btn navigation-button"
            :class="navigationShow ? 'navigation-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.navigation }}</span>
        </div>
      </div>

      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.location }}</span>
        <div class="list-item-btnbox" @click="flyToEarth">
          <div class="list-item-btn flyToEarth-button"></div>
          <span class="list-item-name">{{ lang.earth }}</span>
        </div>
        <div class="list-item-btnbox" @click="flyToChina">
          <div class="list-item-btn flyToChina-button"></div>
          <span class="list-item-name">{{ lang.china }}</span>
        </div>
      </div>

      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.interaction }}</span>
        <div class="list-item-btnbox" @click="depthDetectionShow = !depthDetectionShow">
          <div
            class="list-item-btn depthDetection-button"
            :class="depthDetectionShow ? 'depthDetection-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.depthDetection }}</span>
        </div>
        <div class="list-item-btnbox" @click="mousePickUp">
          <div
            class="list-item-btn mousePickUp-button"
            :class="mousePickUpShow ? 'mousePickUp-button-active' : ''"
          ></div>
          <span class="list-item-name">{{ lang.mousePickUp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 开始模块
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2023-02-08 19:11
   * @FilePath: ztm-earth-vue3/src/views/Controls/Start/index.js
   */

  import language from "./index_local.js";
  import { ref, watch } from "vue";
  import { Cartesian3, Math } from "cesium";
  import useCesium from "@/hooks/useCesium";

  const Cesium = useCesium();
  const lang = ref(language.ch);
  const navigationShow = ref(true);
  const depthDetectionShow = ref(false);
  const mousePickUpShow = ref(false);
  // 跳转到全球视角
  const flyToEarth = () => {
    window.Viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(110, 16, 20000000),
      orientation: {
        heading: Math.toRadians(0),
        pitch: Math.toRadians(-90),
        roll: 0.0
      },
      duration: 1
    });
  };

  // 跳转到中国视角
  // todo: 跳转到中国视角的图标china_on.png跟china.png图标大小相差一个像素，导致鼠标移入该图标时会有缩小的现象
  const flyToChina = () => {
    window.Viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(109, 33.2, 5000000),
      orientation: {
        heading: Math.toRadians(0),
        pitch: Math.toRadians(-90),
        roll: 0.0
      },
      duration: 1
    });
  };

  // 鼠标拾取事件
  const mousePickUp = () => {
    mousePickUpShow.value ? clearPickController() : pickController();
  };

  const clearPickController = () => {
    mousePickUpShow.value = !mousePickUpShow.value;
    // 清除左键单机事件
    window.Viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  };
  const pickController = () => {
    mousePickUpShow.value = !mousePickUpShow.value;
    //双击鼠标左键清除默认事件
    window.Viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    const handler = new Cesium.ScreenSpaceEventHandler(window.Viewer.canvas);
    // 设置左键单机事件
    handler.setInputAction(function (event) {
      let pickedObject = window.Viewer.scene.pick(event.position);
      if (!Cesium.defined(pickedObject)) {
        console.log("没有拾取到空间对象");
        return;
      }
      console.log(pickedObject);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  /**
   * 拾取屏幕像素位置的cesium要素，并判断是什么类型
   * @param x 像素横坐标
   * @param y 像素纵坐标
   * @returns {*}
   */
  const pickFeatureFromScreen = (x, y) => {
    // 存放拾取结果
    let resp = {
      pickResult: null
    };

    // 从像素坐标拾取对象
    let pickCartesian2 = new Cesium.Cartesian2(x, y);
    let feature = window.Viewer.scene.pick(pickCartesian2);

    // 判断拾取结果
    if (Cesium.defined(feature)) {
      // feature.primitive.constructor.name 也可以获取类型
      resp.pickResult = feature; // 拾取结果
      if (feature.hasOwnProperty("id") && feature.id instanceof Cesium.Entity) {
        // 是entity: {collection, id, primitive}
        resp.type = "Entity";
        resp.detailType = feature.primitive.constructor.name;
        resp.entity = feature.id;
      } else if (feature.primitive instanceof Cesium.Cesium3DTileset) {
        // 是3DTile: {content, primitive}
        resp.type = "Cesium3DTileset";
      } else if (feature.primitive instanceof Cesium.Billboard) {
        // 是primitive-billboard: {collection, id, primitive}
        resp.type = "Billboard";
        resp.id = feature.id;
        resp.billboardCollection = feature.collection;
        resp.billboard = feature.primitive;
      } else if (feature.primitive instanceof Cesium.Primitive) {
        // 是primitive: { primitive}
        resp.type = "Primitive";
        resp.primitive = feature.primitive;
      } else if (feature.primitive instanceof Cesium.Model) {
        // 是mode
        resp.type = "Primitive";
        resp.detailType = "Model";
        resp.primitive = feature.primitive;
      }
    }
    return resp;
  };

  // 设置深度测试
  watch(depthDetectionShow, () => {
    depthDetectionShow.value
      ? (window.Viewer.scene.globe.depthTestAgainstTerrain = true)
      : (window.Viewer.scene.globe.depthTestAgainstTerrain = false);
  });

  // 设置导航空间的显隐
  watch(navigationShow, () => {
    navigationShow.value
      ? (document.getElementById("navigationDiv").style.visibility = "visible")
      : (document.getElementById("navigationDiv").style.visibility = "hidden");
  });
</script>
<style scoped lang="less">
  .navigation-button {
    background: url("../../../assets/img/controls/navigation.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .navigation-button:hover,
  .navigation-button-active {
    background: url("../../../assets/img/controls/navigation_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .flyToEarth-button {
    background: url("../../../assets/img/controls/earth.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .flyToEarth-button:hover,
  .flyToEarth-button-active {
    background: url("../../../assets/img/controls/earth_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .flyToChina-button {
    background: url("../../../assets/img/controls/china.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .flyToChina-button:hover,
  .flyToChina-button-active {
    background: url("../../../assets/img/controls/china_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .depthDetection-button {
    background: url("../../../assets/img/controls/depthDetection.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .depthDetection-button:hover,
  .depthDetection-button-active {
    background: url("../../../assets/img/controls/depthDetection_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .mousePickUp-button {
    background: url("../../../assets/img/controls/mousePickUp.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .mousePickUp-button:hover,
  .mousePickUp-button-active {
    background: url("../../../assets/img/controls/mousePickUp_on.png") no-repeat;
    background-size: contain;
    cursor: pointer;
  }
</style>
