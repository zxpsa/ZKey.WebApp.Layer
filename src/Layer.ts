
import Vue from 'vue';
import ModalWarp from './components/ModalWarp.vue';
import { LayerType } from './Enums';
import PageTemplate from './components/PageTemplate.vue';
import './css/layer.css';

/**
 * 弹窗配置
 */
export interface LayerOpt {
    /** 其他约定配置 */
    [key:string]:any;
    /** 是否自动显示 */
    autoShow?: boolean;
    /** 弹窗类型 */
    type?: LayerType;
    /** 是否有遮罩层 */
    hasMask?: boolean;
    /** 点击遮罩层是否关闭 */
    maskClose?: boolean;
    /** 模板组件 */
    templateComponent?: Vue.ComponentOptions<any> | Vue.VueConstructor;
    /** 默认外框类型 0.无外框 1.常规*/
    defaultFrame?:number;
}

enum ModalStatus {
    /** 待销毁 */
    WaitDestroy,
    /** 弹窗准备过程中 */
    Readying,
    /** 待显示 */
    WaitShow,
    /** 显示过程中 */
    Showing,
    /** 待隐藏 */
    WaitHide,
    /** 隐藏过程中 */
    Hideing
} 

const ActualComponentOpt = Vue.extend({
    name: 'ActualComponent',
    functional: true,
    render: function (h: Vue.CreateElement, context: Vue.RenderContext) {
        let modal: Layer = context.props.modal;
        if (!context.data.props) context.data.props = {};
        context.data.props = Object.assign(context.data.props, modal.params);
        context.data.props.zkLayer = modal;
        context.data.on = Object.assign({},context.data.on, modal.listeners);
        context.data.attrs['actual-component'] = true;
        let tag;
        if (typeof modal.component == 'string') {
            tag = 'iframe';
            context.data.attrs['src'] = modal.component;
        }else{
            tag = modal.component;
        }
        return h(
            tag,   // 标签名称
            context.data,
            context.children // 子节点数组
        )
    },
    props: {
        modal: {
            type: Object,
            required: true
        }
    }
});

/**
 * 实际组价包装
 */
export const ActualComponent = ActualComponentOpt;

const modalState = Vue.observable({
    zkLayers:[]
});

const ZkLayer = Vue.extend({
    name: 'ZkLayer',
    functional: true,
    render:function(h,ctx) {
        let zkLayers = modalState.zkLayers;
        let arr = [
            h('div',{
                attrs:{
                    id:'zk-layer-mask'
                }
            })
        ];
        zkLayers.forEach(item => {
            arr.push(h(ModalWarp,{
                props:{
                    'zk-layer':item
                },
                key:item.code,
                attrs:{
                    'is-modal-warp':true
                }
            }))
        });
        return h('div', arr);
    }
});

/**
 * 弹窗实现类
 */
export class Layer {
    /**全局唯一性编号 */
    private static code: number = 0;
    /**全局层级编码 */
    private static zIndex: number = 0;
    /** 单页环境路由配置 */
    private static routes:any[];
    /** 当前组件配置 */
    component: Vue.ComponentOptions<any> | Vue.VueConstructor | string;
    /** 传入组件参数 */
    params: { [key: string]: any } = {};
    /** 弹窗配置 */
    options: LayerOpt;
    /** 事件侦听 */
    listeners: { [key: string]: Function | Array<Function> } = {};
    /** 弹窗根包装组件实例 */
    protected _modalWarpInstance: Vue.Component | Vue.VueConstructor;
    /** 模板组件实例 */
    protected _templateInstance: Vue.Component | Vue;
    /** 业务组价实例 */
    protected _componentInstance: Vue.Component;
    /** 弹窗层级 */
    zIndex: number;
    protected readingFuncs: Function[] = [];
    /** 弹窗状态 */
    status:ModalStatus = ModalStatus.Readying;
    /** 弹窗唯一性编号 */
    private code:number;
    /**
     * @param component 组件
     * @param params 传入组件参数
     */
    private constructor(component: Vue.ComponentOptions<any> | Vue.VueConstructor | string, options?: LayerOpt) {
        this.code = Layer.getCode();
        this.component = component;
        if (!options) options = {} as LayerOpt;
        options = Object.assign(Layer.getDefaultConfig(), options);
        this.options = options;
        this._createComponent();
    }

    /**
     * 重用
     * @param component 
     * @param options 
     */
    protected reusing(component: Vue.ComponentOptions<any> | Vue.VueConstructor | string, options?: LayerOpt) {
        // this.waitDestroy = false;
        this.status = ModalStatus.Readying;
        // 合并配置对象
        if (!options) options = {} as LayerOpt;
        let opt: any = Object.assign(Layer.getDefaultConfig(), options);
        const opt1: any = this.options;
        Object.keys(opt).forEach((key: any) => {
            // 避免模板组件重新渲染
            if (key != 'templateComponent') {
                opt1[key] = opt[key];
            }
        });
        this.component = component;
        if (typeof this.component == 'string') {
            // 无常规业务组价,则视为已初始化完毕
            this.setReadyed();
        }
        // 重置事件监听
        this.listeners = {};
    }

    /**
     * 创建组件
     */
    protected _createComponent() {
       modalState.zkLayers.push(this);
    }


    /**
     * 显示弹窗
     * @param params 传入参数
     */
    async show(params?: { [key: string]: any }): Promise<Layer> {
        if (this.status == ModalStatus.Showing) return;
        this.status = ModalStatus.Showing;
        this.params = params;
        this.zIndex = Layer.getZIndex();
        if (this.options.hasMask) {
            Mask.getInstance().show(this);
        }
        await this.ready();
        try {
            await this.touchHook('layerShow');
        } catch (error) {
            Mask.getInstance().hide(this);
            this.status = ModalStatus.WaitShow;
            throw error;
        }
        this.status = ModalStatus.WaitHide;
        return this;
    }

    /**
     * 隐藏弹窗
     */
    async hide() {
        if (this.status != ModalStatus.WaitHide) return;
        this.status = ModalStatus.Hideing;
        Mask.getInstance().hide(this);
        await this.touchHook('beforeLayerHide');
        this.component = null;
        this.status = ModalStatus.WaitDestroy;
    }

    /**
     * 触发事件
     * @param name 事件名称
     */
    async touchHook(name: string) {
        // @ts-ignore
        const cOpt = this._componentInstance ? this._componentInstance.$options : null;
        // @ts-ignore
        const tOpt = this._templateInstance ? this._templateInstance.$options : null;
        // @ts-ignore
        const mOpt = this._modalWarpInstance ? this._modalWarpInstance.$options : null;
        if (name == 'layerShow') {
            if (cOpt && cOpt.layerShow) {
                await cOpt.layerShow.apply(this._componentInstance);
            }
            if (tOpt && tOpt.layerShow) {
                await tOpt.layerShow.apply(this._templateInstance);
            }
            if (mOpt && mOpt.layerShow) {
                await mOpt.layerShow.apply(this._modalWarpInstance);
            }
            await this.touchHook('layerShowed');
        } else if (name == 'beforeLayerShow') {
            if (cOpt && cOpt.beforeLayerShow) {
                await cOpt.beforeLayerShow.apply(this._componentInstance);
            }
            if (tOpt && tOpt.beforeLayerShow) {
                await tOpt.beforeLayerShow.apply(this._templateInstance);
            }
            if (mOpt && mOpt.beforeLayerShow) {
                await mOpt.beforeLayerShow.apply(this._modalWarpInstance);
            }
        } else if (name == 'beforeLayerHide') {
            if (cOpt && cOpt.beforeLayerHide) {
                await cOpt.beforeLayerHide.apply(this._componentInstance);
            }
            if (tOpt && tOpt.beforeLayerHide) {
                await tOpt.beforeLayerHide.apply(this._templateInstance);
            }
            if (mOpt && mOpt.beforeLayerHide) {
                await mOpt.beforeLayerHide.apply(this._modalWarpInstance);
            }
        } else if (name == 'layerShowed') {
            if (cOpt && cOpt.layerShowed) {
                await cOpt.layerShowed.apply(this._componentInstance);
            }
            if (tOpt && tOpt.layerShowed) {
                await tOpt.layerShowed.apply(this._templateInstance);
            }
            if (mOpt && mOpt.layerShowed) {
                await mOpt.layerShowed.apply(this._modalWarpInstance);
            }
        }
    }

    /**
     * 回收弹窗
     */
    destroy() {
        let array = modalState.zkLayers;
        for (let index = array.length - 1; index > -1; index--) {
            const element = array[index];
            if (element == this) {
                array.splice(index, 1);
                break;
            }
        }
    }

    /**
     * 监听弹窗组件的事件
     * @param eventName 事件名称
     * @param callback 事件回调
     */
    on(eventName: string, callback: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            let func = function (val: any) {
                resolve(val);
                callback && callback(val);
            };
            if (this.listeners.hasOwnProperty(eventName)) {
                if (typeof this.listeners[eventName] == 'function') {
                    this.listeners[eventName] = [];
                }
                (this.listeners[eventName] as Array<Function>).push(func);
            } else {
                this.listeners[eventName] = func;
            }
        });
    }

    /**
     * 暴露插件安装方法
     * @param Vue Vue构造类
     * @param options 参数
     */
    static install(_Vue: Vue.VueConstructor, options?: { [key: string]: any }) {
        if (options&&options.routes) {
            // 存在于单页环境中
            this.routes = options.routes;
        }
        // 全局声明弹窗挂载节点
        _Vue.component('ZkLayer', ZkLayer);
        _Vue.component('ActualComponent', ActualComponent);

        _Vue.mixin({
            props: {
                /**
                 * 当前组件所属弹窗
                 */
                zkLayer: Object
            },
            mounted() {
                if (!this.zkLayer) return;
            },
            created() {
                // 一般组件
                if (!this.zkLayer) return;
                // 弹窗内组件
                if (this.$attrs['is-template']) {
                    // 模板组件
                    this.zkLayer._templateInstance = this;
                    if (typeof this.zkLayer.component == 'string') {
                        // 无常规业务组价,则视为已初始化完毕
                        this.zkLayer.setReadyed();
                    }
                } else if (this.$attrs['is-modal-warp']) {
                    // 弹窗根组件
                    this.zkLayer._modalWarpInstance = this;
                } else {
                    // 业务组件
                    this.zkLayer._componentInstance = this;
                    // 业务组件初始化完毕,视为弹窗准备完成
                    this.zkLayer.setReadyed();
                }
            },
            methods: {
                hide() {
                    // @ts-ignore
                    this.zkLayer && this.zkLayer.hide();
                }
            }
        });
    }

    /**
     * 创建并显示弹窗
     * @param component 需要弹出的组件
     * @param params 传入组件的参数
     * @param options 弹窗选项
     */
    static create(component: Vue.ComponentOptions<any> | Vue.VueConstructor|string,params?: { [key: string]: any }, options?: LayerOpt) {
        if (typeof component == 'string') {
            if (component.indexOf('/') == 0) {
                // 传入的是基于根路径的 URL,使用页面模板组件
                if (!options.templateComponent)options.templateComponent = PageTemplate;
                
                // 读取使用当前路由中相应组件
                let hasCompt = false;
                for (const item of Layer.routes) {
                    if (item.path == component) {
                        component = item.component;
                        hasCompt = true;
                        break;
                    }
                }
                if (!hasCompt) {
                    if(Layer.routes){
                        throw Error('未设置路由来源！请在注册时设置路由配置如：Vue.use(Layer,{routes})');
                    }else{
                        throw Error('未在路由中查找到相应组件,请检查页面路由配置！');
                    }
                }
            }else if(component.indexOf('http://') == 0||component.indexOf('https://') == 0){
                // 传入的是页面 URL 则使用页面模板组件
                if (!options.templateComponent)options.templateComponent = PageTemplate;
            }
        }
      
        //#region 复用已存在待销毁的弹窗实例
        // 复用已存在待销毁的弹窗实例
        // 可复用弹窗实例(仅有弹窗根组件复用)
        let modal: Layer;
        for (const item of modalState.zkLayers) {
            if (item.status == ModalStatus.WaitDestroy) {
                if (options && options.templateComponent) {
                    // 弹窗带模板组件仅能复用具有相同模板组件的弹窗
                    if (item.options.templateComponent == options.templateComponent) {
                        modal = item;
                        break;
                    }
                } else {
                    // 无模板组件弹窗复用
                    if (!item.options.templateComponent) {
                        modal = item;
                        break;
                    }
                }
            }
        }
        
        if (!modal) {
            // 未能找到可复用复用的或者带模板组件但模板组件不一致的单独进行实例化
            modal = new this(component, options);
        } else {
            modal.reusing(component, options);
        }
        //#endregion
        if (modal.options.autoShow) {
            modal.show(params);
        }
        return modal;
    }

    protected static getCode() {
        this.code = this.code + 1;
        return this.code;
    }

    protected static getZIndex() {
        this.zIndex = this.zIndex + 2;
        return this.zIndex;
    }

    /**
     * 获取弹窗默认选项
     * 注: 必要时可通过复写该弹窗实现修改弹窗的默认选项
     */
    static getDefaultConfig():LayerOpt {
        return {
            autoShow: true,
            type: LayerType.BottomToCenter,
            hasMask: true,
            maskClose: true,
            defaultFrame:1
        };
    }

    /**
     * 添加初始化完毕时回调
     * @param func 待执行方法
     */
    ready(func?: Function): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.status != ModalStatus.WaitDestroy && this.status != ModalStatus.Readying) {
                func && func();
                resolve();
            } else {
                this.readingFuncs.push(() => {
                    func && func();
                    resolve();
                });
            }
        });
    }

    /**
     * 设置弹窗已准备完毕
     */
    setReadyed() {
        this.status = ModalStatus.WaitShow;
        this.readingFuncs.forEach(func => func());
        this.readingFuncs = [];
    }
}

class Mask {
    static _instance: Mask;
    dom: HTMLElement;

    constructor() {
        this.dom = document.querySelector('#zk-layer-mask') as HTMLElement;
    }

    /**
     * 显示
     * @param modal 从属的弹窗
     */
    show(modal: Layer) {
        this.dom.style.zIndex = '' + (modal.zIndex - 1);
        this.dom.className = 'zk-layer-mask zk-layer-mask-show';
        this.dom.style.display = 'block';
        if (modal.options.maskClose) {
            this.dom.onclick = () => {
                modal.hide();
            }
        }
    }

    /**
     * 隐藏
     * @param modal 从属的弹窗
     */
    hide(modal: Layer) {
        // 寻找展示中的弹窗需要展示遮罩层的
        let topNeedMaskModal: Layer;
        let zkLayers = modalState.zkLayers as Layer[];
        zkLayers.forEach(item => {
            if (modal != item &&item.status==ModalStatus.WaitHide&& item.options.hasMask) {
                if (!topNeedMaskModal) {
                    topNeedMaskModal = item;
                } else {
                    if (topNeedMaskModal.zIndex < item.zIndex) {
                        topNeedMaskModal = item;
                    }
                }
            }
        });
        if (topNeedMaskModal) {
            this.dom.style.zIndex = '' + (topNeedMaskModal.zIndex - 1);
            if (modal.options.maskClose) {
                this.dom.onclick = () => {
                    topNeedMaskModal.hide();
                }
            }
        } else {
            this.dom.className = 'zk-layer-mask zk-layer-mask-hide';
            setTimeout(() => {
                this.dom.style.display = 'none';
            }, 900);
        }
    }

    static getInstance() {
        if (!this._instance) this._instance = new Mask();
        return this._instance;
    }
}