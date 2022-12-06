import { createApp } from 'vue'

import App from './App.vue'
import router, { setupRouter } from './router' // 路由
import { setupElementPlus } from './libs/element' // element UI
import { setupDirective } from './libs/directive/index'
import { setupGlobalCom } from './components/index'
import { setupStore } from './stores/index'

import './assets/styles/index.less'
import mitt from 'mitt';

const app = createApp(App)

setupRouter(app) // 引入路由

setupElementPlus(app) // 引入element组件

setupDirective(app) // 注册全局指令

setupGlobalCom(app) // 注册全局公用组件

setupStore(app) // 注册pinia

app.config.globalProperties.mittBus = mitt()

router.isReady().then(() => {
  app.mount('#app')
})
