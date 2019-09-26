import Vue from 'vue';
import App from './App.vue';
import { Layer } from './../src/Layer';
// console.log(Modal);
// Vue.use(ZKeyWebappModal.Modal);


// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

import TestComponents from './TestComponents.vue';
const routes = [
    { 
        path: '/foo', 
        component: TestComponents 
    },
    { 
        path: '/bar', 
        component: (resolve)=>{
            resolve(TestComponents)
        }
    }
];
Vue.use(Layer, { routes });
new Vue(App).$mount('#app');

// function aa(){
//     this.$layer.alert();
//     this.$layer.createModal('组件','参数','选项').on('事件名称',()=>{

//     });
//     this.createModal
//     this.$app.alert('内容',()=>{
//         Modal.create()
//     });
    // this.app.open('组件','参数','选项').on('事件名称',()=>{

    // });
    // Modal.create(components,{

    // })
// this.app.alert()
// }