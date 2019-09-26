<style lang="postcss">
.zk-modal-warp {
    & {
        left: 0;
        top: 0;
        width: 100%;
        height: 0;
        position: absoult;
    }
    
    .zk-modal-content {
        background-color: #ffffff;
        /* background-color: rebeccapurple; */
        position: fixed;
    }
    
    .zk-modal-center {
        width: 800px;
        height: 500px;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
    }
    .zk-modal-right {
        width: 50%;
        height: 100%;
        right: 0;
        top: 0;
    }
    /* 从底部弹出动画 */
    .zk-modal-b-c-enter,
    .zk-modal-b-c-leave-to {
        transform: translate(-50%, 0);
        left: 50%;
        top: 100%;
    }
    .zk-modal-b-c-enter-active,
    .zk-modal-b-c-leave-active {
        transition: all 0.7s ease-in-out;
    }
    /* 从右侧弹出动画 */
    .zk-modal-r-enter,
    .zk-modal-r-leave-to {
        right: -100%;
        top: 0;
    }
    .zk-modal-r-enter-active,
    .zk-modal-r-leave-active {
        transition: all 0.5s ease-in-out;
    }
}
</style>

<template>
    <div class="zk-modal-warp">
        <transition :name="contentAnimation" @after-leave="onTransitionLeave">
            <div v-if="modal.options.templateComponent" :class="contentCSS" v-show="show" :is="compt" :zk-layer="zkLayer" v-on="modal.listeners" is-template="true" :style="{ 'z-index' : modal.zIndex }"></div>
            <div v-if="!modal.options.templateComponent&&compt" :class="contentCSS" v-show="show" :is="compt" :zk-layer="zkLayer" v-bind="modal.params" v-on="listeners" :style="{ 'z-index' : modal.zIndex }"></div>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LayerType } from './../Enums';
export default {
    data() {
        return {
            show: false,
            maskShow: false,
            // 动画结束
            isTransitionLeave: false,
            // 动画结束执行的方法
            transitionLeaveFunc: []
        }
    },
    computed: {
        modal() {
            return this.zkLayer;
        },
        compt() {
            // 存在模板组件则直接使用模板组件
            if (this.modal.options.templateComponent) {
                return this.modal.options.templateComponent;
            } else {
                return this.modal.component;
            }
        },
        /**
         * 内容区动画名称
         */
        contentAnimation() {
            if (this.modal.options.type == LayerType.BottomToCenter) {
                return 'zk-modal-b-c';
            } else if (this.modal.options.type == LayerType.Right) {
                return 'zk-modal-r';
            }
            return '';
        },
        listeners() {
            return Object.assign({}, this.$listeners, this.modal.listeners);
        },
        contentCSS() {
            let css = {
                'zk-modal-content': this.modal.options.type != LayerType.Custom,
                'zk-modal-center': this.modal.options.type == LayerType.BottomToCenter,
                'zk-modal-right': this.modal.options.type == LayerType.Right
            }
            return css;
        }
    },
    created() {

    },
    methods: {
        excuteShow(next) {
            const _t = this;
            if (this.modal.options.hasMask) this.maskShow = true;
            this.show = true;
            next();
        },
        excuteHide(next) {
            const _t = this;
            this.maskShow = false;
            this.show = false;
            this.addTransitionLeaveListener(() => next());
        },
        /** 点击遮罩层处理 */
        clickMask() {
            if (this.modal.options.maskClose) {
                this.hide();
            }
        },
        onTransitionLeave() {
            this.transitionLeaveFunc.forEach(element => {
                element();
            });
        },
        addTransitionLeaveListener(func) {
            if (this.isTransitionLeave) {
                func();
            } else {
                this.transitionLeaveFunc.push(func);
            }
        }
    },
    // @ts-ignore
    layerShow() {
        return new Promise((resolve, reject) => {
            this.excuteShow(() => resolve())
        });
    },
    beforeLayerHide() {
        return new Promise((resolve, reject) => {
            this.excuteHide(() => resolve())
        });
    }
}
</script>