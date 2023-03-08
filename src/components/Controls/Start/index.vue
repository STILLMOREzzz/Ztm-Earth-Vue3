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

      <div class="controls-list-item">
        <span class="controls-list-name">{{ lang.search }}</span>
        <el-input
          v-model="input"
          placeholder="请输入网格编码进行查询"
          class="controls-search-box"
          :suffix-icon="Search"
        />
        <el-button class="m-2" ref="buttonRef" v-click-outside="onClickOutside" @click="search">
          查询
        </el-button>
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          popper-class="monitor-popper"
          :offset="27"
          placement="bottom-end"
          :width="850"
          trigger="click"
          virtual-triggering
        >
          <el-table :data="gridData">
            <el-table-column width="50" property="id" label="id" />
            <el-table-column width="100" property="name" label="name" />
            <el-table-column width="300" property="grid_code" label="grid_code" />
            <el-table-column width="300" property="url" label="url" />
            <el-table-column fixed="right" label="Operations" width="50">
              <template #default="scope">
                <el-button link type="primary" size="small" @click.prevent="flyTo(scope.$index)">
                  加载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-popover>
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
   * @LastEditTime: 2023-03-08 16:32
   * @FilePath: ztm-earth-vue3/src/views/Controls/Start/index.js
   */

  import language from "./index_local.js";
  import { ref, unref, watch, toRaw } from "vue";
  import { Cartesian3, Math } from "cesium";
  import useCesium from "@/hooks/useCesium";
  import { ClickOutside as vClickOutside } from "element-plus";
  import { Search } from "@element-plus/icons-vue";
  import { getGridCode } from "@/api/gridCode";

  const Cesium = useCesium();
  const lang = ref(language.ch);

  // 用于搜索框
  const input = ref("");
  const buttonRef = ref();
  const popoverRef = ref();
  const gridData = ref();
  /**
   * 通过输入框中的值来发送请求并展示相关数据
   */
  const search = () => {
    getGridCode(input.value).then((res) => {
      console.log(res);
      gridData.value = res.data;
    });
  };
  // proper虚拟触发
  const onClickOutside = () => {
    unref(popoverRef).popperRef?.delayHide?.();
  };
  // proper中加载按钮的事件，跳转到url所在的模型数据，之后需要进行优化
  const flyTo = (index) => {
    const list = toRaw(gridData.value);
    const testTileset = window.Viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: list[index].url
      })
    );
    testTileset.readyPromise.then(function (layer) {
      // tileset的边界球
      let boundingSphere = layer.boundingSphere;
      // 跳到边界球范围
      window.Viewer.camera.flyToBoundingSphere(
        boundingSphere,
        new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
      );
      // 绑定相机所在的位置：必须设置，否则左键移动变成单点定位
      window.Viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    });
  };

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
  const mousePickUpShow = ref(false);
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
  const depthDetectionShow = ref(false);
  watch(depthDetectionShow, () => {
    depthDetectionShow.value
      ? (window.Viewer.scene.globe.depthTestAgainstTerrain = true)
      : (window.Viewer.scene.globe.depthTestAgainstTerrain = false);
  });

  // 设置导航空间的显隐
  const navigationShow = ref(true);
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
