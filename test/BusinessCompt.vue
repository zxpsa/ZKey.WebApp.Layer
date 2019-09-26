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
