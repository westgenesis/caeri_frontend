<template>
    <div style="margin: 20px;">
        <a-page-header title="项目管理" />

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入项目名称" style="width: 200px"
                @search="fetchProjectList" />
            <a-button type="primary" @click="toCreate"> 新增项目 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="projectList" :rowKey="record => record.project_id"
            :pagination="paginationConfig">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="deleteProject(record.project_id)">删除</a-button>
                </template>
            </template>
        </a-table>


        <!-- 编辑项目模态框 -->
        <a-modal title="编辑项目" v-model:visible="editModalVisible" @ok="updateProject" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="editForm">
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
                        <a-select-option value="001">小王</a-select-option>
                        <a-select-option value="002">小李</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="项目成员" name="member_ids">
                    <a-select v-model:value="editFormData.member_ids" mode="multiple">
                        <a-select-option value="001">小李</a-select-option>
                        <a-select-option value="002">小张</a-select-option>
                        <a-select-option value="003">小王</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="客户信息" name="customer_id">
                    <a-select v-model:value="editFormData.customer_id">
                        <a-select-option value="001">客户A</a-select-option>
                        <a-select-option value="002">客户B</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="项目计划周期" name="period">
                    <a-range-picker v-model:value="editFormData.period" />
                </a-form-item>
                <a-form-item label="项目优先级" name="priority">
                    <a-radio-group v-model:value="editFormData.priority">
                        <a-radio value="高">高</a-radio>
                        <a-radio value="中">中</a-radio>
                        <a-radio value="低">低</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="上传项目附件" name="files">
                    <input type="file" @change="handleEditFileUpload" multiple />
                    <ul>
                        <li v-for="file in editFormData.files" :key="file.name">{{ file.name }}</li>
                    </ul>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { http } from '../../http';
import { useRouter } from 'vue-router';
const router = useRouter();

const searchText = ref('');
const projectList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createFormData = reactive({ project_name: '', project_number: '', comment: '', manager_id: '', member_ids: [], customer_id: '', period: [], priority: '', files: [] });
const editFormData = reactive({ project_id: '', project_name: '', project_number: '', comment: '', manager_id: '', member_ids: [], customer_id: '', period: [], priority: '', files: [] });

const columns = [
    { title: '项目ID', dataIndex: 'project_id' },
    { title: '项目名称', dataIndex: 'project_name' },
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

onMounted(() => {
    fetchProjectList();
});

const toCreate = () => {
    router.replace('/createProject')
}

const fetchProjectList = async () => {
    const { data } = await http.post('/test/v1/projects/get_projects_list', { name: searchText.value || undefined });
    projectList.value = data.data;
};

const showCreateModal = () => {
    createModalVisible.value = true;
};

const createProject = async () => {
    if (!createFormData.project_name) {
        ElMessage.error('请输入项目名称');
        return;
    }

    await http.post('/test/v1/projects/create_projects', createFormData);
    ElMessage.success('创建项目成功');
    createModalVisible.value = false;
    fetchProjectList();
};

const showEditModal = (record) => {
    editFormData.project_id = record.project_id;
    editFormData.project_name = record.project_name;
    editFormData.project_number = record.project_number;
    editFormData.comment = record.comment;
    editFormData.manager_id = record.manager_id;
    editFormData.member_ids = record.member_ids;
    editFormData.customer_id = record.customer_id;
    editFormData.period = record.period;
    editFormData.priority = record.priority;
    editModalVisible.value = true;
};

const updateProject = async () => {
    await http.post('/test/v1/projects/update_project', editFormData);
    ElMessage.success('更新项目成功');
    editModalVisible.value = false;
    fetchProjectList();
};

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
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const handleFileUpload = (event) => {
    createFormData.files = Array.from(event.target.files);
};

const handleEditFileUpload = (event) => {
    editFormData.files = Array.from(event.target.files);
};
</script>

<style scoped></style>