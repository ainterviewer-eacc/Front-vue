<template>
    <div class="input-area">
        <el-input class="inputDeep" ref="input" v-model="inputValue" placeholder="Message..." type="textarea"
            :rows="minRows" :autosize="{ minRows: minRows, maxRows: 4 }" @keydown.enter.prevent="sendMessage" />
        <el-button :disabled="isLoading" type="primary" @click="sendMessage" ref="submitButton" class="submit-button"
            circle>
            <div class="button-css" id="button-content" v-if="!isLoading"></div>
            <div class="button-css" id="loading-ring" v-if="isLoading"></div>
        </el-button>
    </div>
</template>

<script>
    export default {
        name: 'InputArea',
        props: {
            isLoading: Boolean,
        },
        data() {
            return {
                inputValue: '',
                minRows: 1,
            };
        },
        mounted() {
            this.$refs.input.focus();
        },
        emits: ['submit-answer'],  // 添加一个自定义事件
        methods: {
            sendMessage() {
                if (this.isLoading || this.inputValue.trim() === '') {
                    // 如果正在加载或输入为空，则不执行任何操作
                    return;
                }

                // 触发自定义事件，发送用户的回答
                this.$emit('submit-answer', this.inputValue);
                // 清空输入框
                this.inputValue = '';

                this.$nextTick(() => {
                    this.$refs.input.focus(); // 重新聚焦到输入框
                });
            },
        },

    };
</script>

<style>
    .input-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.1rem;
        background-color: transparent;
        min-height: 36px;
        width: 9.8rem;
        box-shadow: 0px -5px 5px rgba(55, 55, 55, 0.1);
        position: fixed;
        bottom: 0%;
    }

    .el-input .el-input__inner,
    .el-textarea .el-textarea__inner {
        box-shadow: 0 0 0 0px;
        flex-grow: 1;
        border-radius: 20px;
    }

    .submit-button {
        position: fixed;
        box-shadow: 0 0 0 0px;
        border-radius: 20px !important;
        border: none;
        background-color: rgba(30, 30, 80, 0) !important;
        transition: all 0.3s ease;
        min-width: 36px;
        position: relative;
        overflow: hidden;
        transform-origin: center;
    }

    /* 隐藏按钮内容的样式 */
    .button-content {
        visibility: visible;
        position: relative;
        z-index: 1;
    }

    .button-css {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        margin: auto;
        transform: translate(-50%, -50%);
        z-index: 99999;
    }

    #button-content {
        background: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.9));
        /* box-shadow: 0px 0px 4px 0px rgba(10, 10, 20, 0.1); */
        animation: spin 10s linear infinite;
    }

    #loading-ring {
        background: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(0, 0, 50, 0.5));
        /* box-shadow: 0px 0px 4px 0px rgba(110, 110, 120, 0.1); */
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>