<template>
  <div class="container">
    <el-button
      v-for="(value, index) in langCh"
      :key="index"
      :class="['tab-button', { active: currentTab === index }]"
      @click="currentTab = index"
      text
    >
      {{ value }}
    </el-button>
    <keep-alive>
      <component :is="currentTab" class="tab"></component>
    </keep-alive>
  </div>
</template>

<script>
  /**
   * @Author: STILLMOREzzz
   * @Date: 2022-12-12
   * @Description: 顶部控制
   * @LastEditors: STILLMOREzzz
   * @LastEditTime: 2022-12-30 16:47
   * @FilePath: ztm-earth-vue3/src/views/Controls/index.vue
   */
  import language from "./index_local.js";
  import { ref, defineComponent, onBeforeMount } from "vue";

  import Start from "@/components/Controls/Start/index.vue";
  import Messure from "@/components/Controls/Measure/index.vue";
  import Layer from "@/components/Controls/Layer/index.vue";
  import Tileset from "@/components/Controls/Tileset/index.vue";
  import Other from "@/components/Controls/Other/index.vue";

  function initControls() {
    onBeforeMount(() => {});
  }

  export default defineComponent({
    components: { Start, Messure, Layer, Tileset, Other },
    setup() {
      const langCh = ref(language.ch);
      const currentTab = ref("Start"); // 控制当前显示的组件

      initControls();

      return { langCh, currentTab };
    }
  });
</script>
<style scoped lang="less">
  .container {
    box-sizing: border-box;
    font-family: sans-serif;
    user-select: none;
    overflow: hidden;
    height: auto;
    font-size: 1.2rem;

    :deep(.el-button) {
      margin: 0;
    }

    .tab-button {
      cursor: pointer;
      background: #f0f0f0;

      &:hover,
      &.active {
        background: #e0e0e0;
      }
    }

    .tab {
      border: 1px solid #ccc;
    }
  }
</style>
