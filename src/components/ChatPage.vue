<template>
    <div class="ChatPage">
        <Title />
        <div class="HeadTitle-box">
            <div class="HeadTitle">
                <HeaderMain />
            </div>
        </div>
        <div id="line-for-title" :class="{ 'loading-animation-title': isLoading }">
        </div>
        <!-- 使用HeaderMain组件 -->
        <div class="content" :class="{ 'fade-in': isFadingIn }">
            <!-- 使用ChatWindow组件 -->
            <ChatWindow :chatData="chatData" />
            <!-- 使用InputArea组件 -->
            <InputArea :isLoading="isLoading" @submit-answer="handleAnswerSubmission" />
        </div>
    </div>
</template>

<script>
    import { ref, onMounted } from 'vue';
    import HeaderMain from '@/components/HeaderMain.vue'; // 导入ChatWindow组件
    import ChatWindow from '@/components/ChatWindow.vue'; // 导入ChatWindow组件
    import InputArea from '@/components/InputArea.vue'; // 导入InputArea组件
    import axios from 'axios';
    import { useRouter } from "vue-router"; // 导入vue-router中的useRouter

    export default {
        name: 'ChatPage',
        components: {
            HeaderMain,
            ChatWindow,
            InputArea,
        },
        setup() {
            const router = useRouter();
            const isFadingIn = ref(false);
            const chatData = ref([]);
            const currentQuestionId = ref();
            const isLoading = ref(false);
            const currentQuestionNumber = ref(1);

            onMounted(() => {
                // 使用$nextTick确保标题元素渲染完毕后再获取宽度并触发动画
                import('animejs').then((anime) => {
                    const titleElement = document.querySelector('.HeadTitle h1');
                    const titleWidth = titleElement.offsetWidth;
                    const screenWidth = window.innerWidth;
                    isFadingIn.value = true;
                    anime.default({
                        targets: '.HeadTitle',
                        translateX: -(screenWidth / 2 - titleWidth / 2 - 18),
                        duration: 1200,
                        easing: 'easeInOutQuad',
                    });
                    anime.default({
                        targets: '.content',
                        height: '95vh',
                        duration: 1200,
                        easing: 'easeInOutQuad',
                        direction: 'alternate',
                        loop: false,
                    });
                });
                // 获取问题
                fetchChatData();
            });

            // 发送HTTP GET请求获取问题
            // fetchChatData方法定义
            const fetchChatData = async () => {
                isLoading.value = true; // 启动加载状态
                try {
                    chatData.value.push({ type: 'bot', text: '欢迎您，面试即将开始，请做好准备！' });
                    chatData.value.push({ type: 'bot', text: '正在准备面试题。。。' });
                    const session_id = router.currentRoute.value.params.session_id;
                    const response = await axios.get(`http://101.43.4.104:8081/test`);
                    const { question_id, interview_question, current_topic } = response.data.data;
                    currentQuestionId.value = question_id;
                    chatData.value.push({ type: 'bot', text: 'Question' + currentQuestionNumber.value + '主题：' + '“' + current_topic + '”'});
                    chatData.value.push({ type: 'bot', text: interview_question });
                    currentQuestionNumber.value++; // 增加题号
                } catch (error) {
                    console.error('请求第三个端口失败:', error);
                    // 可以在这里处理错误，例如显示错误消息
                } finally {
                    isLoading.value = false; // 关闭加载状态
                }
            };

            const handleAnswerSubmission = async (answer) => {
                chatData.value.push({ type: 'user', text: answer });
                isLoading.value = true;
                if (currentQuestionNumber.value === 6) {
                    // 在currentQuestionNumber.value为6时调用结束接口
                    try {
                        chatData.value.push({ type: 'bot', text: '辛苦啦！面试结束，请等待最终评分：' });
                        chatData.value.push({ type: 'bot', text: '正在汇总评价。。。' });
                        const session_id = router.currentRoute.value.params.session_id;
                        const response = await axios.get(`http://101.43.4.104:8081/session_close?session_id=${session_id}`);
                        const { feedback_result } = response.data.data;
                        chatData.value.push({ type: 'bot', text: feedback_result });
                    } catch (error) {
                        console.error('请求面试结束端口失败:', error);
                        // 可以在这里处理错误，例如显示错误消息
                    } finally {
                        isLoading.value = false; // 关闭加载状态
                    }
                }
                else {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        const response = await axios.post('http://101.43.4.104:8081/upload_answer', {
                            answer: answer
                        }, {
                            params: {
                                user_id: '123456',
                                session_id: router.currentRoute.value.params.session_id,
                                question_id: currentQuestionId.value,
                            },
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.data.ret === '0') {
                            const { next_question_id, interview_question, evaluation, current_topic } = response.data.data;
                            currentQuestionId.value = next_question_id;
                            chatData.value.push({ type: 'bot', text: "针对您回答的简单评述：" + evaluation });
                            chatData.value.push({ type: 'bot', text: "我们继续" });
                            chatData.value.push({ type: 'bot', text: 'Question' + currentQuestionNumber.value + '主题：' + '“' + current_topic + '”'});
                            chatData.value.push({ type: 'bot', text: interview_question });
                            currentQuestionNumber.value++; // 增加题号
                        } {
                            console.error('服务器返回错误:', response.data.err);
                            if (response.data.err !== 'success') {
                                chatData.value.push({ type: 'bot', text: '服务有点问题，程序员快马加鞭维修中！' });
                            }
                        }
                    } catch (error) {
                        console.error('提交回答失败:', error);
                        if (error !== 'success') {
                            chatData.value.push({ type: 'bot', text: '服务有点问题，程序员快马加鞭维修中！！' });
                        }
                    } finally {
                        isLoading.value = false;
                    }
                }
            };

            return {
                isFadingIn,
                chatData,
                currentQuestionId, // 注意，这里不需要加 '', 因为你已经声明了这个变量
                handleAnswerSubmission, // 将 handleAnswerSubmission 方法暴露出去
                router, // 将 router 暴露出去
                isLoading
            };
        },
    };
</script>

<style>
    .HeadTitle-box {
        box-shadow: 0px 5px 5px rgba(55, 55, 55, 0.1);
    }

    .ChatPage {
        font-size: 20px;
        height: 100vh;
        background-color: transparent;
    }

    .content {
        display: flex;
        flex-direction: column;
        background-color: transparent;
    }

    .fade-in {
        animation: fadeInEffect 2s forwards;
    }

    @keyframes fadeInEffect {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }
</style>