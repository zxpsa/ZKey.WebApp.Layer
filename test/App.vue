<template>
    <div>
        <div class="aa">测试</div>
        <div v-text="msg"></div>
        <input type="checkbox" name="111" id />
        <input type="button" value="底部弹出" @click="bottomToCenter" />
        <input type="button" value="右侧弹出" @click="right" />
        <input type="button" value="自定义弹出" @click="customPopup" />
        <input type="button" value="自定义弹出1" @click="customPopup1" />
        <input type="button" value="弹出alert" @click="alert1" />
        <input type="button" value="测试弹出单页页面组件" @click="testPagePopup" />
        <input type="button" value="测试弹出多页组件" @click="testPagePopup2" />
        <zk-layer></zk-layer>
    </div>
</template>

<script lang="ts">
import TestComponents from './TestComponents.vue';
import Vue from 'vue';
import TemplateCompt from './TemplateCompt.vue';
import BusinessCompt from './BusinessCompt.vue';
import { Layer } from '../src/Layer';
import { LayerType } from '../src/Enums';

export default {
    data() {
        return {
            msg: 123123
        }
    },
    methods: {
        bottomToCenter() {
            Layer.create(TestComponents, {
                a4: '底部弹出',
                func: function(param) {
                    console.log(param);
                }
            });
        },
        right() {
            Layer.create(TestComponents, {
                a4: '右侧弹出',
                func: function(param) {
                    console.log(param);
                }
            }, {
                type: LayerType.Right
            });
        },
        customPopup() {
            let layer = Layer.create(BusinessCompt, {
                a4: '的卡就是看大家'
            }, {
                type: LayerType.Custom,
                hasMask: false,
                templateComponent: TemplateCompt
            });
            layer.on('custom-event', val => {
                console.log(val);
            });
            layer.on('custom-event', val => {
                console.log(val);
            });
        },
        customPopup1() {
            Layer.create(BusinessCompt, {
                a4: '的卡就是看大家1'
            }, {
                type: LayerType.Custom,
                hasMask: false,
                templateComponent: TemplateCompt
            }).on('custom-event', val => {
                console.log(val);
            });
        },
        testPagePopup() {
           console.log(123);
            Layer.create('/bar', {
                a4: '的卡就是看大家123'
            }, {
               type: LayerType.BottomToCenter,
            }).on('custom-event', val => {
                console.log(val);
            });
        },
        testPagePopup2() {
           console.log(123);
            Layer.create('https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login', {
                a4: '的卡就是看大家1'
            }, {
               type: LayerType.BottomToCenter,
            }).on('custom-event', val => {
                console.log(val);
            });
        },
        alert1() {
            this.$alert('asdasd');
        }
    }
}
</script>