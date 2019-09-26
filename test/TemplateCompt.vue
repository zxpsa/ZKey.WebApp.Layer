<template>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <actual-component :modal="zkLayer"  @eventt1="eventt1" @hide="close"></actual-component>
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
//// 导入业务组件标签
// import { ActualComponent } from '@zkey-webapp/layer';
import { ActualComponent } from './../src/Index';

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
});
</script>

