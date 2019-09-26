<template>
    <a @click="testFunc" style="width:100px;display:block">asdfasdf组件12,{{test}},{{a4}}</a>
</template>

<script lang="ts">
import Vue from 'vue'
import TestComponents from './TestComponents.vue'
import { Layer } from '../src/Layer';
export default Vue.extend({
    props: {
        a4: String,
        func: Function
    },
    created() {
        // console.log('this.$parent', this.$parent);
        // this.func(123333);
    },
    data() {
        return {
            test: '参数12'
        }
    },
    methods:{
        testFunc(){
            this.$emit('event1', '123123');
            Layer.create(TestComponents, {
                a4: '底部弹出1',
                func: function (param) {
                console.log(param);
                }
            },{type: 1});
        }
    }
})
</script>

