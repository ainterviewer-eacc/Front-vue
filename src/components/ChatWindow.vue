<template>
    <div class="chat-window" ref="chatWindow">
        <!-- 循环遍历显示新的接口数据 -->
        <div v-for="(message, index) in chatData" :key="index" class="message">

            <!-- 用户头像和信息-->
            <div v-if="message.type === 'user'" class="user-content">
                <img :src="require('@/assets/user_1.jpg')" alt="User Avatar" class="user-avatar">
                <div class="user-message">
                    {{ message.text }}
                </div>
            </div>

            <!-- 机器人头像和信息-->
            <div v-if="message.type === 'bot'" class="bot-content">
                <img :src="require('@/assets/bot_1.jpg')" alt="Bot Avatar" class="bot-avatar">
                <div class="bot-message">
                    {{ message.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ChatWindow',
        props: {
            chatData: {
                type: Array,
                default: () => [],
            },
            isLoading: Boolean,
        },
        updated() {
            // 在组件更新时滚动到底部
            this.scrollToBottom();
        },
        methods: {
            scrollToBottom() {
                this.$nextTick(() => {
                    const chatWindow = this.$refs.chatWindow;
                    // 检查用户当前是否滚动到接近底部
                    chatWindow.scrollTop = chatWindow.scrollHeight + 5;
                });
            },
        },
    }
</script>

<style scoped>
    .chat-window {
        flex-grow: 1;
        overflow-y: auto;
        /* background-color: rgba(255, 255, 255, 0.3); */
    }

    .message {
        margin: 10px;
        padding: 5px 10px;
        border-radius: 20px;
        max-width: 100%;
        word-wrap: break-word;
        /* 使用Flexbox布局 */
    }

    .user-content {
        /* background-color: rgba(5, 5, 120, 0.8); */
        width: 99%;
        padding-left: 10px;
        font-size: 18px;
        float: right;
        padding-bottom: 12px;
    }

    .user-avatar {
        border-radius: 16px;
        float: right;
        height: 44px;
        width: 44px;
        margin-left: 10px;
    }

    .user-message {
        /* background-color: rgba(5, 5, 120, 0.8); */
        background-color: rgba(0, 10, 60, 0.7);
        color: rgba(245, 245, 255, 0.95);
        max-width: 60%;
        min-height: 24px;
        padding: 9px;
        border-radius: 9px;
        font-size: 18px;
        float: right;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25),
            0px -3px 6px rgba(255, 255, 255, 0.8);
        position: relative;
    }

    .bot-content {
        /* background-color: rgba(5, 5, 120, 0.8); */
        width: 99%;
        padding-right: 10px;
        font-size: 18px;
        float: left;
        padding-bottom: 12px;
    }

    .bot-avatar {
        border-radius: 16px;
        float: left;
        height: 44px;
        width: 44px;
        margin-right: 10px;
    }

    .bot-message {
        /* background-color: rgba(5, 5, 5, 0.05); */
        background-color: rgba(235, 154, 79, 0.814);
        max-width: 66%;
        min-height: 24px;
        padding: 9px;
        border-radius: 9px;
        color: rgba(5, 5, 55, 0.95);
        font-size: 18px;
        float: left;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2),
            0px -3px 6px rgba(255, 255, 255, 0.8);
    }
</style>
