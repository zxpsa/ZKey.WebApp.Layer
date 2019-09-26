import Vue from 'vue';
import { LayerType } from './Enums';
/**
 * 模态窗参数
 */
export interface LayerOpt {
    /** 是否自动显示 */
    autoShow?: boolean;
    /** 模态窗类型 */
    type?: LayerType;
    /** 是否有遮罩层 */
    hasMask?: boolean;
    /** 点击遮罩层是否关闭 */
    maskClose?: boolean;
    /** 模板组件 */
    templateComponent?: Vue.ComponentOptions<any> | Vue.VueConstructor;
}
declare enum ModalStatus {
    WaitShow = 0,
    Showing = 1,
    WaitHide = 2,
    Hideing = 3
}
/**
 * 实际组价包装
 */
export declare const ActualComponent: {
    name: string;
    functional: boolean;
    render: (h: import("vue").CreateElement, context: import("vue").RenderContext<Record<string, any>>) => import("vue").VNode;
    props: {
        modal: {
            type: ObjectConstructor;
            required: boolean;
        };
    };
};
/**
 * 模态窗参数
 */
export declare class Layer {
    /**全局唯一性编号 */
    static code: number;
    /**全局层级编码 */
    static zIndex: number;
    /** 当前组件 */
    component: Vue.ComponentOptions<any> | Vue.VueConstructor;
    /** 传入组件参数 */
    params: {
        [key: string]: any;
    };
    /** 模态窗配置 */
    options: LayerOpt;
    /** 事件侦听 */
    listeners: {
        [key: string]: Function | Array<Function>;
    };
    /** 模态窗根包装组件实例 */
    _modalWarpInstance: Vue.Component | Vue.VueConstructor;
    /** 模板组件实例 */
    _templateInstance: Vue.Component | Vue;
    /** 业务组价实例 */
    _componentInstance: Vue.Component;
    /** 待销毁 */
    waitDestroy: boolean;
    /** 模态窗层级 */
    zIndex: number;
    /** 准备完毕标志 */
    readyed: boolean;
    readingFuncs: Function[];
    /** 模态窗状态 */
    _status: ModalStatus;
    /** 模态窗唯一性编号 */
    code: number;
    /**
     * @param component 组件
     * @param params 传入组件参数
     */
    constructor(component: Vue.ComponentOptions<any> | Vue.VueConstructor, options?: LayerOpt);
    /**
     * 重用
     * @param component
     * @param options
     */
    reusing(component: Vue.ComponentOptions<any> | Vue.VueConstructor, options?: LayerOpt): void;
    /**
     * 创建组件
     */
    _createComponent(): void;
    /**
     * 显示模态窗
     * @param params 传入参数
     */
    show(params?: {
        [key: string]: any;
    }): Promise<Layer>;
    /**
     * 隐藏模态窗
     */
    hide(): Promise<void>;
    /**
     * 触发事件
     * @param name 事件名称
     */
    touchHook(name: string): Promise<void>;
    /**
     * 模态窗显示完毕回调
     */
    onShowed(): Promise<void>;
    /**
     * 回收模态窗
     */
    destroy(): void;
    /**
     * 监听模态窗组件的事件
     * @param eventName 事件名称
     * @param callback 事件回调
     */
    on(eventName: string, callback: Function): Promise<any>;
    /**
     * 暴露插件安装方法
     * @param Vue Vue构造类
     * @param options 参数
     */
    static install(_Vue: Vue.VueConstructor): void;
    static create(component: Vue.ComponentOptions<any> | Vue.VueConstructor, params?: {
        [key: string]: any;
    }, options?: LayerOpt): Layer;
    static getCode(): number;
    static getZIndex(): number;
    static getDefaultConfig(): {
        autoShow: boolean;
        type: LayerType;
        hasMask: boolean;
        maskClose: boolean;
    };
    /**
     * 添加初始化完毕时回调
     * @param func 待执行方法
     */
    ready(func?: Function): Promise<void>;
    /**
     * 设置准备完毕
     */
    setReadyed(): void;
}
export {};
