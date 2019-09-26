# ZKey.WebApp.Layer
> 正在快速完善中...稍晚开源
> 一个基于 vue 的基础弹窗，无需为每一个弹窗声明挂载点
> [API文档地址](https://zxpsa.github.io/ZKey.WebApp.Layer/docs)
> 发布包地址:
> [游览器版：index.js](https://zxpsa.github.io/ZKey.WebApp.Layer/dist/index.js)
> [游览器压缩版：index.min.js](https://zxpsa.github.io/ZKey.WebApp.Layer/dist/index.min.js)
> [esm版：index.esm.js](https://zxpsa.github.io/ZKey.WebApp.Layer/dist/index.esm.js)
> [esm版css：index.esm.css](https://zxpsa.github.io/ZKey.WebApp.Layer/dist/index.esm.css)

## 快速开始
> 所有弹出组件中均会注入:
> 当前弹窗实例对象: vm.zkLayer 
> 隐藏当前弹窗方法: vm.hide 
### 通过script方式使用
#### HTML
```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://zxpsa.github.io/ZKey.WebApp.Layer/dist/index.min.js"></script>
<div id="app">
    <!-- 所有弹窗都将渲染在这里 -->
	<zk-layer></zk-layer>
</div>
```
#### JavaScript
```javascript
const Layer = ZKeyWebappLayer.Layer;
// 注册插件
Vue.use(Layer);
// 1. 定义组件
const 需要弹出的组件 = { template:'<div style="background-color: rebeccapurple">需要弹出的组件</div>' };
// 2. 使用
new Vue({
    el: '#app',
    created() {
        Layer.create(需要弹出的组件, {
            a4: '普通 string',
            func: function (param) {
                console.log(param);
            }
        });
    }
});
```
### 通过NPM包使用

``` shell
$ npm install @zkey-webapp/layer
```
#### App.vue
```html
<template>
    <div>
        <!-- 所有弹窗都将渲染在这里 -->
        <zk-layer></zk-layer>
    </div>
</template>
```
#### JavaScript
```javascript
import Vue from 'vue';
import { Layer } from '@zkey-webapp/layer';
// 注册插件
Vue.use(Layer);
import App from './App.vue';
new Vue(App).$mount('#app');
```

## 使用自定义弹窗效果
#### 模板组件.vue
> 可以在模板组件中定义弹窗的样式,效果以及一些预先处理
```html
<template>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <!--业务组件挂载点(必写)-->
        <actual-component :modal="zkLayer"  @eventt1="eventt1"></actual-component>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
//// 导入业务组件标签
import { ActualComponent } from '@zkey-webapp/layer';

export default Vue.extend({
    components:{
        ActualComponent
    },
    created() {
        // 传入的配置
        console.log('this.zkLayer.options',this.zkLayer.options);
        // 传入组件的参数
        console.log('this.zkLayer.params',this.zkLayer.params);
    },
    data() {
        return {
            dialogVisible: true
        }
    },
    methods: {
        close(){
            this.dialogVisible = false;
            // 隐藏弹窗
            this.hide();
        },
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                done();
                this.dialogVisible = false;
                this.hide();
            }).catch(_ => {
                console.log(_);
            });
        },
        eventt1(){
            console.log('模板组件收到业务组件通知-');
        }
    },
    // @ts-ignore
    beforeLayerHide(){
        console.log('触发:弹窗隐藏前钩子');
        // 若为处理过程为异步可返回 Promise
    },
    layerShowed(){
        console.log('触发:弹窗显示后钩子');
        this.dialogVisible = true;
        // 若为处理过程为异步可返回 Promise
    }
})
</script>
```

#### 需要弹出的组件(业务组件).vue
> 即业务组件
```html
<style lang="postcss" scope>
    .sub-text{
        color: red;
    }

    button{
        width: auto;
        height: 30px;
        background-color: rebeccapurple;
        color: #ffffff;
    }
</style>

<template>
    <div>
        <div>
            <div>这是一段详细信息</div>
            <button @click="testFunc">发送消息给模板组件</button>
            <button @click="hideFunc">隐藏</button>
            <div>
                传入参数: <span v-text="a4" class="sub-text"></span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        // 外部传入参数
        a4: {
            type: String
        }
    },
    created(){
        console.log('this.a4:',this.a4);
        console.log(this.zkLayer);
    }, 
    methods:{
        testFunc(){
            console.log('业务组价发出通知');
            this.$emit('eventt', '发送给调用层通知');
            this.$emit('eventt1', '发送给模板组件通知');
        },
        hideFunc(){
            this.$emit('hide', '通知模板组件隐藏');
        }
    }
})
</script>
```

#### 调用组件.vue
```html
<script>
import { Layer,LayerType } from '@zkey-webapp/layer';
import 模板组件 from './模板组件.vue';
import 业务组件 from './业务组件.vue';

export default {
    methods:{
        customPopup() {
            // 创建弹窗并显示 业务组件或者要加载的路径入'/path1/path2'或者'http://www'
            let layer = Layer.create(业务组件, {
                a4: '传入业务组件参数1'
            }, {
                type: LayerType.Custom,
                hasMask: false,
                templateComponent: 模板组件
            });
            // 监听业务组件或者模板组件事件
            layer.on('custom-event', val => {
                console.log(val);
            });
        }
    }
}
</script>
```

## 使用路径弹出组件或者页面
> 支持通过Url加载相应的页面和vue页面组件

#### JavaScript
```javascript
// 使用前
// 已配置好的vue单页路由
const routes = [{ 
    path: '/foo', 
    component: 业务组件 
}];
// 注册插件
Vue.use(Layer, { routes });
```

#### 调用组件.vue
```html
<script>
import { Layer,LayerType } from '@zkey-webapp/layer';

export default {
    methods:{
        customPopup() {
            // 创建弹窗并显示 业务组件或者要加载的路径入'/path1/path2'或者'http://www'
            let layer = Layer.create('https://www.baidu.com', {
                a4: '传入业务组件参数1'
            });
            // 监听业务组件或者模板组件事件
            layer.on('custom-event', val => {
                console.log(val);
            });
        }
    }
}
</script>
```
