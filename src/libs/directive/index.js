import directObj from "./directiveConf";

export function setupDirective(app) {
  app.directive("cust-drag-dialog", {
    mounted(el, bindings, vnode, preVnode) {
      const domDragContainer = el.firstElementChild.firstElementChild;
      directObj.bind(domDragContainer);
      directObj.update(domDragContainer, bindings);
    },
  });
}
