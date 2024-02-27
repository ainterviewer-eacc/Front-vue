<template>
    <div class="HeadTitle">
        <HeaderMain />
    </div>
    <div class="PreferenceSelect" :class="{ 'fade-out': isFadingOut }">
        <h2>岗位</h2>
        <el-select v-model="selectedPosition" placeholder="请选择职位" @change="handlePositionChange">
            <el-option v-for="position in positionList" :key="position" :label="position" :value="position">
            </el-option>
        </el-select>
        <h2>技术方向</h2>
        <el-select v-model="selectedTopic" multiple placeholder="请选择职位主题">
            <el-option v-for="topic in availableTopics" :key="topic" :label="topic" :value="topic">
            </el-option>
        </el-select>
        <el-button id="button_commit" type="primary" @click="sendPreferences">开始面试问答</el-button>
    </div>
</template>

<script>
    import axios from 'axios';
    import HeaderMain from '@/components/HeaderMain.vue'; // 导入HeaderMain组件

    export default {
        name: 'PreferenceSelect',
        components: {
            HeaderMain,
        },
        data() {
            return {
                positionList: [],
                topicMap: {},
                selectedPosition: '', // 用户选择的职位
                selectedTopic: '', // 用户选择的职位主题
                availableTopics: [], // 根据选择的职位可用的主题列表
                isFadingOut: false, //用于实现淡出效果
                requestInfo: '',      // 用于存储请求信息
                requestResult: null,  // 用于存储请求结果
                session_id: null, // 初始化为null，接口返回session id用于下一个路由
            };
        },
        methods: {
            // fetchLabels 方法用于从 API 获取数据
            fetchLabels() {
                // 使用 axios 发送 GET 请求
                axios.get('http://101.43.4.104:8081/query_label')
                    .then(response => {
                        // 检查响应的 ret 码，0 表示请求成功
                        if (response.data.ret === '0') {
                            // 将获取到的数据赋值给组件的数据属性
                            this.positionList = response.data.data.position_list;
                            this.topicMap = response.data.data.topic_map;
                        } else {
                            // 如果 ret 码不是 0，输出错误信息
                            console.error('获取标签数据出错:', response.data.err);
                        }
                    })
                    .catch(error => {
                        // 如果请求失败，输出错误信息
                        console.error('请求失败:', error);
                    });
            },
            handlePositionChange(newValue) {
                this.selectedPosition = newValue;
                this.availableTopics = this.topicMap[newValue] || [];
                // 在这里你可以根据新的值执行更多的操作，比如更新其他数据
            },
            sendPreferences() {
                // 构建请求数据
                const requestData = {
                    position: this.selectedPosition,
                    topic_list: this.selectedTopic,
                };

                // 记录请求信息
                this.requestInfo = `URL: http://101.43.4.104:8081/upload_user_preferences\n` +
                    `Method: POST\n` +
                    `Request Headers: Content-Type: application/json\n` +
                    `Request Body: ${JSON.stringify(requestData, null, 2)}`;

                // 使用 axios 发送 POST 请求
                axios.post('http://101.43.4.104:8081/upload_user_preferences', requestData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        // 设置请求结果
                        this.requestResult = response.data;
                        const session_id = response.data.data.session_id;
                        // 使用 $router.push() 方法来导航到另一个组件
                        this.isFadingOut = true;
                        setTimeout(() => {
                            this.$router.push({ name: 'Chat', params: { session_id } });
                        }, 450); // 假设淡出动画持续500ms
                    })
                    .catch(error => {
                        // 如果请求失败，输出错误信息，并记录错误信息
                        console.error('请求失败:', error);

                        // 记录错误信息
                        this.requestInfo = `Error occurred while sending request: ${error.message}`;
                        // 清空请求结果
                        this.requestResult = null;
                    });
            },
        },
        mounted() {
            this.fetchLabels();
        }
    };
</script>

<style>
    .PreferenceSelect {
        /* 添加所需的样式 */
        background-color: transparent;
        width: 6rem;
        padding-top: 20%;
        padding-left: 2rem;
    }

    h2 {
        font-size: 18px;
        text-align: center;
    }

    #button_commit {
        margin-top: 50%;
        margin-left: auto;
        margin-right: auto;
        display: block;
        flex-grow: 1;
        /* 使按钮水平居中 */
        background-color: rgba(30, 30, 80, 0.9);
        /* 按钮背景 */
        color: rgba(222, 222, 222, 1);
        /* 按钮文字 */
        border-color: rgba(30, 30, 80, 0.5);
        /* 按钮边框颜色*/
        box-shadow: 0 0 0 0px !important;
        border-radius: 18px !important;
        font-weight: 600;
        font-size: 17px;
    }


    .fade-out {
        animation: fadeOutEffect 0.5s forwards;
    }

    @keyframes fadeOutEffect {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
</style>