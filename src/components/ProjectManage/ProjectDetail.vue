<template>
    <div style="height: 100%; overflow: auto;">
        <a-page-header title="项目详情" @back="$router.push('/projectManage')" />
        <div style="padding: 20px;">
            <a-row gutter="16">
                <a-col span="24">
                    <a-card title="项目信息">
                        <p>名称: {{ projectDetail.project_name }}</p>
                        <p>起止时间: {{ projectDetail.period_start }} ~ {{ projectDetail.period_end }}</p>
                        <p>项目描述: {{ projectDetail.comment }}</p>
                    </a-card>
                </a-col>
            </a-row>

            <a-divider />

            <a-row gutter="16">
                <a-col span="8">
                    <a-card title="项目负责人">
                        <div>
                            <a-avatar style="color: #fde3cf; background-color: orangered" size="large">
                                {{ projectDetail?.manager?.user_name }}
                            </a-avatar>
                        </div>
                    </a-card>
                </a-col>
                <a-col span="8">
                    <a-card title="客户信息">
                        <a-avatar v-if="projectDetail?.customer?.name" style="color: yellow; background-color: yellowgreen" size="large">
                                {{ projectDetail?.customer?.name }}
                            </a-avatar>
                    </a-card>
                </a-col>
                <a-col span="8">
                    <a-card title="项目成员">
                        <a-avatar-group>
                            <a-avatar style="color: #f56a00; background-color: #fde3cf" v-for="member in projectDetail.members" :key="member.user_id"
                                >{{ member.user_name }}</a-avatar>
                        </a-avatar-group>
                    </a-card>
                </a-col>
            </a-row>

            <a-divider />

            <a-row gutter="16">
                <a-col span="24">
                    <a-card title="项目文件">
                        <div v-for="file in projectDetail.file_list" :key="file"
                            style="display: flex; align-items: center;">
                            <span>{{ file }}</span>
                            <a-button type="link" @click="downloadFile(file)" style="margin-left: 10px;">
                                <DownloadOutlined /> 下载
                            </a-button>
                        </div>
                    </a-card>
                </a-col>
            </a-row>

            <a-divider />

            <a-row gutter="16">
                <a-col span="24">
                    <a-card title="测试任务">
                        <a-table :columns="taskColumns" :dataSource="projectDetail.tasks" />
                    </a-card>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProjectStore } from '../../stores/project';
import { storeToRefs } from 'pinia';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { http } from '../../http';

const projectStore = useProjectStore();
const { projectDetail } = storeToRefs(projectStore);

onMounted(() => {
    console.log(projectDetail);
});

const taskColumns = [
    {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '测试样品',
        dataIndex: 'sample',
        key: 'sample',
    },
    {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '用例数',
        dataIndex: 'num_of_cases',
        key: 'num_of_cases',
    },
    {
        title: '计划时间',
        dataIndex: 'plan_time',
        key: 'plan_time',
    },
    {
        title: '创建时间',
        dataIndex: 'created_time',
        key: 'created_time',
    },
    {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
    },
];

// 假设 projectDetail.tasks 是以下形式的数据
onMounted(() => {
    console.log(projectDetail.value);
    projectDetail.value.tasks = [
        {
            name: '蓝牙模块测试',
            sample: '车机系统',
            status: '进行中',
            num_of_cases: 15,
            plan_time: '2024-5-5至2024-7-7',
            created_time: '2024-01-01',
            creator: '小王',
        },
        {
            name: 'T-Box测试',
            sample: '车机系统',
            status: '进行中',
            num_of_cases: 12,
            plan_time: '2024-5-5至2024-7-7',
            created_time: '2024-01-01',
            creator: '小王',
        },
        {
            name: 'T-Box测试',
            sample: '车机系统',
            status: '已完成',
            num_of_cases: 10,
            plan_time: '2024-5-5至2024-7-7',
            created_time: '2024-05-05',
            creator: '小王',
        },
        {
            name: 'T-Box测试',
            sample: '车机系统',
            status: '未开始',
            num_of_cases: 14,
            plan_time: '2024-5-5至2024-7-7',
            created_time: '2024-05-05',
            creator: '小王',
        },
    ];
});

const downloadFile = (filename) => {
    http.post(`/test/v1/projects/get_file`, {
        project_id: projectDetail.value.project_id,
        filename: filename,
    }, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // 移除下载链接
            link.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('下载文件失败', error);
        });
};
</script>

<style scoped>
/* 添加需要的自定义样式 */
</style>