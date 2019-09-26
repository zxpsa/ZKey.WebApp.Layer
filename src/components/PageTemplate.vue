<style lang="postcss">
.page-template {
    width: 800px;
    height: 450px;
    position: fixed;
    left: 0;
    top: 0;
    & [actual-component]{
        width: 100%;
        height: 100%;
    }
}
</style>

<template>
    <div class="page-template">
        <actual-component :modal="zkLayer" frameborder="0"></actual-component>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>
