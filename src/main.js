import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router, { setupRouter } from './router' // 路由
import { setupElementPlus } from './libs/element' // element UI
import { setupDirective } from './libs/directive/index'
import { setupGlobalCom } from './components/index'

import './assets/styles/main.less'
import mitt from 'mitt';

const app = createApp(App)

setupRouter(app) // 引入路由

setupElementPlus(app) // 引入element组件

setupDirective(app) // 注册全局指令

setupGlobalCom(app) // 注册全局公用组件

app.use(createPinia())

app.config.globalProperties.mittBus = mitt()

router.isReady().then(() => {
  app.mount('#app')
})
