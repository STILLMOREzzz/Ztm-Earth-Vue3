/**
 * @Author: 赵天铭
 * @Date: 2022-12-06
 * @Description: 指令配置
 * @LastEditors: 赵天铭
 * @LastEditTime: 2022-12-06
 * @FilePath: ztm-earth-vue3/src/utils/directive/index.js
 */
import directObj from "./directiveConf";

export function setupDirective(app) {
  app.directive("cust-drag-dialog", {
    mounted(el, bindings, vnode, preVnode) {
      const domDragContainer = el.firstElementChild.firstElementChild;
      directObj.bind(domDragContainer);
      directObj.update(domDragContainer, bindings);
    }
  });
}
