import Vue from "vue";
declare module "vue/types/vue" {
    interface Vue {
        /**
         * 发送隐藏当前组件通知
         */
        hide(): void;
    }
}

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {

    }
}