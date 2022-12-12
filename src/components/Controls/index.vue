<template>
  <div class="container">
    <el-button
      v-for="(value, index) in langCh"
      :key="index"
      :class="['tab-button', { active: currentTab === index }]"
      @click="currentTab = index"
    >
      {{ value }}
    </el-button>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
  /**
   * @Author: 赵天铭
   * @Date: 2022-12-12
   * @Description: 顶部控制
   * @LastEditors: 赵天铭
   * @LastEditTime: 2022-12-13 0:11
   * @FilePath: ztm-earth-vue3/src/views/Controls/index.vue
   */
  import language from "./index_local.js";
  import { ref, computed, defineComponent, onBeforeMount } from "vue";

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
    border: 2rem solid #eee;
    /*padding: 2rem 3rem;*/
    /*margin-top: 1em;*/
    /*margin-bottom: 4rem;*/
    user-select: none;
    overflow: hidden;
    height: auto;
    font-size: 1.6rem;

    .tab-button {
      padding: 6px 10px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      border: 1px solid #ccc;
      cursor: pointer;
      background: #f0f0f0;
      margin-bottom: -1px;
      margin-right: -1px;
    }
    .tab-button:hover {
      background: #e0e0e0;
    }
    .tab-button.active {
      background: #e0e0e0;
    }
    .tab {
      border: 1px solid #ccc;
      padding: 1rem;
    }
  }
</style>
