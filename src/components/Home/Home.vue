<template>
    <div>
        <div>上午好，admin!</div>

        <div class="flex h-[160px]">
            <a-card style="width: 70%">
                <strong>快捷操作</strong>
                <div class="quick-actions">
                    <div class="action-item">
                        <img :src="project" />
                        <div @click="$router.push('/createProject')">新建项目</div>
                    </div>
                    <div class="action-item">
                        <img :src="usecase" />
                        <div>新建用例</div>
                    </div>
                    <div class="action-item">
                        <img :src="mission" />
                        <div>新建任务</div>
                    </div>
                    <div class="action-item">
                        <img :src="report" />
                        <div>下载报告</div>
                    </div>
                </div>
            </a-card>

            <div class="charts" style="padding: 1rem; border: 1px #eee solid">
                <div class="chart-container">
                    <div class="chart-title">项目总数</div>
                    <div id="projectChart" class="chart"></div>
                </div>
                <div class="chart-container">
                    <div class="chart-title">测试任务总数</div>
                    <div id="taskChart" class="chart"></div>
                </div>
            </div>
        </div>

        <div style="margin: 20px;">
            <a-tabs default-active-key="1">
                <a-tab-pane key="1" tab="我负责的项目">
                    <a-table :columns="columns" :dataSource="managedProjects" :rowKey="record => record.project_id" :scroll="{ y: table_height }">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                                <a-button type="link" size="small" @click="deleteProject(record.project_id)">删除</a-button>
                            </template>
                            <template v-if="column.key === 'project_name'">
                                <a-button type="link" size="small" @click="goToProjectDetail(record)">{{ record.project_name }}</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="2" tab="我参与的项目">
                    <a-table :columns="columns" :dataSource="participatedProjects" :rowKey="record => record.project_id" :scroll="{ y: table_height }">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                                <a-button type="link" size="small" @click="deleteProject(record.project_id)">删除</a-button>
                            </template>
                            <template v-if="column.key === 'project_name'">
                                <a-button type="link" size="small" @click="goToProjectDetail(record)">{{ record.project_name }}</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import project from './project.png'
import usecase from './usecase.png'
import mission from './mission.png'
import report from './report.png'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { http } from '../../http'

const route = useRoute();
const router = useRouter();
const currentAccount = ref(localStorage.getItem('account'));
const managedProjects = ref([]);
const participatedProjects = ref([]);
const table_height = window.innerHeight * 0.55;

const columns = [
    { title: '项目ID', dataIndex: 'project_id' },
    { title: '项目名称', dataIndex: 'project_name', key: 'project_name'},
    { title: '项目编码', dataIndex: 'project_number' },
    { title: '项目经理', dataIndex: 'manager', customRender: ({ text }) => text.user_name },
    { title: '客户信息', dataIndex: 'customer', customRender: ({ text }) => text.name },
    { title: '项目计划周期', dataIndex: 'period', customRender: ({ record }) => `${record.period_start} ~ ${record.period_end}` },
    { title: '项目优先级', dataIndex: 'priority', customRender: ({ record}) => `${recordMap[record.priority]}`},
    { title: '创建时间', dataIndex: 'created_time' },
    { title: '创建者', dataIndex: 'creator' },
    { title: '项目描述', dataIndex: 'comment' },
    {
        title: '操作',
        key: 'action'
    },
];

const recordMap = {
    'low': '低',
    'medium':'中',
    'high': '高'
}

const fetchManagedProjects = async () => {
    try {
        const response = await http.post('/test/v1/projects/get_projects_list', { manager_id: window.localStorage.getItem('user_id') });
        managedProjects.value = response.data;
    } catch (error) {
        ElMessage.error('获取我负责的项目列表失败');
    }
};

const fetchParticipatedProjects = async () => {
    try {
        const response = await http.post('/test/v1/projects/get_projects_list', { member_id: window.localStorage.getItem('user_id') });
        participatedProjects.value = response.data;
    } catch (error) {
        ElMessage.error('获取我参与的项目列表失败');
    }
};

onMounted(() => {
    fetchManagedProjects();
    fetchParticipatedProjects();
    initCharts();
});

onUnmounted(() => {
    if (projectChart) {
        projectChart.dispose();
    }
    if (taskChart) {
        taskChart.dispose();
    }
});

let projectChart: echarts.ECharts | null = null;
let taskChart: echarts.ECharts | null = null;

const initCharts = () => {
    if (typeof echarts !== 'undefined') {
        const projectChartContainer = document.getElementById('projectChart');
        if (projectChartContainer) {
            projectChart = echarts.init(projectChartContainer);
            projectChart.setOption({
                title: { text: '', subtext: '', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: { orient: 'horizontal', left: 'left', bottom: 10 },
                series: [
                    {
                        name: '项目',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        data: [
                            { value: 1048, name: '已完成' },
                            { value: 735, name: '进行中' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }

        const taskChartContainer = document.getElementById('taskChart');
        if (taskChartContainer) {
            taskChart = echarts.init(taskChartContainer);
            taskChart.setOption({
                title: { text: '', subtext: '', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: { orient: 'horizontal', left: 'left', bottom: 10 },
                series: [
                    {
                        name: '任务',
                        type: 'pie',
                        radius: ['40%', '50%'],
                        data: [
                            { value: 580, name: '已完成' },
                            { value: 234, name: '进行中' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
    }
};

watch(route, () => {
    currentAccount.value = localStorage.getItem('account');
});
</script>

<style scoped lang="less">
.quick-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
}

.action-item {
    text-align: center;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 2px solid transparent;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;

    div {
        margin-left: 0.5rem;
    }

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-color: #1890ff;
    }
}

.charts {
    display: flex;
    justify-content: space-around;
}

.chart-container {
    width: 280px;
    display: flex;
}

.chart-title {
    text-align: center;
    font-weight: bold;
    position: absolute;
    margin-bottom: 1rem;
}

.chart {
    width: 100%;
}

img {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.5rem;
}
</style>