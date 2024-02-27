<template>
    <header>
        <h1>AI面试官</h1>
    </header>
</template>

<script>
    export default {
        name: 'HeaderMain',
    };
</script>

<style scoped>
    header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10rem;
        height: 0.9rem;
        /* 调整为所需高度 */
    }

    h1 {
        margin: 0;
        padding: 0;
        /* 移除h1的默认外边距 */
    }
</style>