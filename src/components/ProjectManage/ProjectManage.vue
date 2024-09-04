<template>
    <div style="margin: 20px;">
        <a-page-header title="项目管理" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入项目名称" style="width: 200px"
                @search="fetchProjectList" />
            <a-button type="primary" @click="toCreate"> 新增项目 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="projectList" :rowKey="record => record.project_id"
            :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="deleteProject(record.project_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <!-- 编辑项目模态框 -->
        <a-drawer title="编辑项目" :visible="editDrawerVisible" @close="handleCancel" :width="600">
            <a-form :form="editForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" labelAlign="left">
                <a-form-item label="项目名称" name="project_name">
                    <a-input v-model:value="editFormData.project_name" />
                </a-form-item>
                <a-form-item label="项目编码" name="project_number">
                    <a-input v-model:value="editFormData.project_number" />
                </a-form-item>
                <a-form-item label="项目描述" name="comment">
                    <a-textarea v-model:value="editFormData.comment" />
                </a-form-item>
                <a-form-item label="项目经理" name="manager_id">
                    <a-select v-model:value="editFormData.manager_id">
                        <a-select-option v-for="user in userList" :key="user.user_id" :value="user.user_id">{{
                            user.user_name
                            }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="项目成员" name="member_ids">
                    <a-select v-model:value="editFormData.member_ids" mode="multiple">
                        <a-select-option v-for="user in userList" :key="user.user_id" :value="user.user_id">{{
                            user.user_name
                            }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="客户信息" name="customer_id">
                    <a-select v-model:value="editFormData.customer_id">
                        <a-select-option v-for="customer in customerList" :key="customer.customer_id"
                            :value="customer.customer_id">{{ customer.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="项目计划周期" name="period">
                    <a-range-picker v-model:value="editFormData.period" @change="changePeriod" />
                </a-form-item>
                <a-form-item label="项目优先级" name="priority">
                    <a-radio-group v-model:value="editFormData.priority" button-style="solid">
                        <a-radio-button value="high">高</a-radio-button>
                        <a-radio-button value="medium">中</a-radio-button>
                        <a-radio-button value="low">低</a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="项目附件" name="files">
                    <div v-for="file in fileList" :key="file">
                        {{ file }}
                        <a-button type="link" @click="downloadFile(file)">
                            <DownloadOutlined />
                        </a-button>
                        <a-button type="link" class="ml-[1rem]" @click="deleteFile(file)">
                            <DeleteOutlined />
                        </a-button>
                    </div>
                    <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUpload"
                        accept=".doc,.docx,.pdf,.xlsx,.png">
                        <template #trigger>
                            <el-button>上传文件</el-button>
                        </template>
                    </el-upload>
                </a-form-item>
            </a-form>

            <div class="flex justify-end">
                <a-button type="primary" @click="updateProject">确定</a-button>
                <a-button @click="handleCancel" style="margin-left: 1rem">取消</a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { http } from '../../http';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { DownloadOutlined, DeleteOutlined} from '@ant-design/icons-vue';

const router = useRouter();

const searchText = ref('');
const projectList = ref([
]);
const editDrawerVisible = ref(false);
const createFormData = reactive({ project_name: '', project_number: '', comment: '', manager_id: '', member_ids: [], customer_id: '', period: [], priority: '', files: [] });
const editFormData = reactive({ project_id: '', project_name: '', project_number: '', comment: '', manager_id: '', member_ids: [], customer_id: '', period: [], priority: '', files: [] });

const userList = ref([]);
const customerList = ref([]);
const fileList = ref([]);
const table_height = window.innerHeight * 0.55;
const recordMap = {
    'low': '低',
    'medium':'中',
    'high': '高'
}
const columns = [
    { title: '项目ID', dataIndex: 'project_id' },
    { title: '项目名称', dataIndex: 'project_name' },
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

const paginationConfig = reactive({
    total: 1000,
    pageSize: 10,
    current: 1,
    onChange: (page, pageSize) => {
        paginationConfig.current = page;
        paginationConfig.pageSize = pageSize;
        fetchProjectList();
    },
});

const fetchUserList = async () => {
    try {
        const response = await http.post('/test/v1/users/get_user_list', {});
        userList.value = response.data;
    } catch (error) {
        ElMessage.error('获取用户列表失败');
    }
};

const fetchCustomerList = async () => {
    try {
        const response = await http.post('/test/v1/customers/get_customer_list', {});
        customerList.value = response.data;
    } catch (error) {
        ElMessage.error('获取客户列表失败');
    }
};

onMounted(() => {
    fetchProjectList();
    fetchUserList();
    fetchCustomerList();
});

const toCreate = () => {
    router.replace('/createProject')
}

const fetchProjectList = async () => {
    const data = await http.post('/test/v1/projects/get_projects_list', { name: searchText.value || undefined });
    projectList.value = data.data;
};

const showEditModal = (record) => {
    editFormData.project_id = record.project_id;
    editFormData.project_name = record.project_name;
    editFormData.project_number = record.project_number;
    editFormData.comment = record.comment;
    editFormData.manager_id = record.manager.user_id;
    editFormData.member_ids = record.members.map(member => member.user_id);
    editFormData.customer_id = record.customer.customer_id;
    editFormData.period = [dayjs(record.period_start), dayjs(record.period_end)];
    editFormData.priority = record.priority;
    editDrawerVisible.value = true;
    fileList.value = record.file_list;
};

const updateProject = async () => {
    const params = {
        ...editFormData,
        period_start: editFormData.period_start,
        period_end: editFormData.period_end,
    };
    delete params.period;

    try {
        await http.post('/test/v1/projects/update_project', params);
        ElMessage.success('更新项目成功');
        editDrawerVisible.value = false;
        fetchProjectList();
    } catch (error) {
        ElMessage.error('更新项目失败');
    }
};

const changePeriod = (v, strs) => {
    if (!strs?.length) {
        return;
    }
    editFormData.period_start = strs[0];
    editFormData.period_end = strs[1];
}

const deleteProject = async (projectId) => {
    await ElMessageBox.confirm('确定要删除该项目吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    });

    await http.post('/test/v1/projects/delete_project', { project_id: projectId });
    ElMessage.success('删除项目成功');
    fetchProjectList();
};

const handleCancel = () => {
    editDrawerVisible.value = false;
};

const handleFileUpload = (event) => {
    createFormData.files = Array.from(event.target.files);
};

const handleEditFileUpload = (event) => {
    editFormData.files = Array.from(event.target.files);
};
const downloadFile = (filename) => {
    http.post(`/test/v1/projects/get_file`, {
        project_id: editFormData.project_id,
        filename:filename,
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

const deleteFile = (filename) => {
    http.post('/test/v1/projects/delete_project_file', {
        project_id: editFormData.project_id,
        filename:filename,
    }).then(response => {
        if (response.status === 'ok') {
            ElMessage.success('删除文件成功');
        } else {
            ElMessage.success('删除文件失败');
        }

    }).catch(error => {
        ElMessage.error('删除文件失败');
    });
}

const onBeforeUpload = async (file) => {
  const formData = new FormData();
  
  // 将 info 作为字符串附加到 FormData 中
  formData.append('info', JSON.stringify({ category: 'knowledges_update', project_id: editFormData.project_id}));
  
  // 将文件附加到 FormData 中，使用后端期望的参数名 'file'
  formData.append('file', file.raw);
  try {
    const response = await http.post(`/test/v1/projects/upload_project_file`, formData);
  } catch (error) {
    console.error("Upload failed: ", error);
  }
};
</script>

<style scoped>
:deep(.el-upload__input) {
    display: none !important;
}
</style>