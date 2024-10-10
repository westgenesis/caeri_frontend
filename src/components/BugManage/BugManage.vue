<template>
    <div style="margin: 20px;">
        <a-page-header title="漏洞库管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入漏洞名称" style="width: 200px"
                @search="fetchBugList" />
            <a-button type="primary" @click="showCreateModal"> 新增漏洞 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="bugList" :rowKey="record => record.bug_id"
            pagination="paginationConfig" :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="showEditModal(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="deleteBug(record.bug_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增漏洞" v-model:visible="createModalVisible" @ok="createBug" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="createForm" :model="createFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="漏洞名称" name="bug_name">
                        <a-input v-model:value="createFormData.bug_name" />
                    </a-form-item>
                    <a-form-item label="漏洞编号" name="bug_number">
                        <a-input v-model:value="createFormData.bug_number" />
                    </a-form-item>
                    <a-form-item label="危害等级" name="danger_level">
                        <a-select v-model:value="createFormData.danger_level">
                            <a-select-option value="low">低</a-select-option>
                            <a-select-option value="medium">中</a-select-option>
                            <a-select-option value="high">高</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="漏洞简介" name="description">
                        <a-textarea v-model:value="createFormData.description" />
                    </a-form-item>
                    <a-form-item label="修改建议" name="advice">
                        <a-textarea v-model:value="createFormData.advice" />
                    </a-form-item>
                    <a-form-item label="漏洞类型" name="type_name">
                        <a-select v-model:value="createFormData.type_name" @change="handleTypeChange">
                            <a-select-option v-for="type in bugTypes" :key="type.type_id" :value="type.type_name">
                                {{ type.type_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>

        <a-modal title="编辑漏洞" v-model:visible="editModalVisible" @ok="updateBug" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="editForm" :model="editFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="漏洞名称" name="bug_name">
                        <a-input v-model:value="editFormData.bug_name" />
                    </a-form-item>
                    <a-form-item label="漏洞编号" name="bug_number">
                        <a-input v-model:value="editFormData.bug_number" />
                    </a-form-item>
                    <a-form-item label="危害等级" name="danger_level">
                        <a-select v-model:value="editFormData.danger_level">
                            <a-select-option value="low">低</a-select-option>
                            <a-select-option value="medium">中</a-select-option>
                            <a-select-option value="high">高</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="漏洞简介" name="description">
                        <a-textarea v-model:value="editFormData.description" />
                    </a-form-item>
                    <a-form-item label="修改建议" name="advice">
                        <a-textarea v-model:value="editFormData.advice" />
                    </a-form-item>
                    <a-form-item label="漏洞类型" name="type_name">
                        <a-select v-model:value="editFormData.type_name" @change="handleTypeChange">
                            <a-select-option v-for="type in bugTypes" :key="type.type_id" :value="type.type_name">
                                {{ type.type_name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox } from 'element-plus';

const searchText = ref('');
const bugList = ref([]);
const bugTypes = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createForm = ref(null);
const editForm = ref(null);

const createFormData = reactive({
    bug_name: '',
    bug_number: '',
    danger_level: '',
    description: '',
    advice: '',
    type_name: '',
});

const editFormData = reactive({
    bug_id: '',
    bug_name: '',
    bug_number: '',
    danger_level: '',
    description: '',
    advice: '',
    type_name: '',
});

const columns = [
    { title: '漏洞ID', dataIndex: 'bug_id' },
    { title: '漏洞名称', dataIndex: 'bug_name' },
    { title: '漏洞编号', dataIndex: 'bug_number' },
    { title: '危害等级', dataIndex: 'danger_level' },
    { title: '漏洞简介', dataIndex: 'description' },
    { title: '修改建议', dataIndex: 'advice' },
    { title: '漏洞库类型', dataIndex: 'type_name' },
    { title: '创建者', dataIndex: 'creator' },
    { title: '创建时间', dataIndex: 'created_time' },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

const paginationConfig = reactive({
    total: 1000,
    pageSize: 100,
    current: 1,
    onChange: (page, pageSize) => {
        paginationConfig.current = page;
        paginationConfig.pageSize = pageSize;
        fetchBugList();
    },
});

onMounted(() => {
    fetchBugList();
    fetchBugTypes();
});

const fetchBugList = async () => {
    const data = await http.post('/test/v1/bugs/get_bugs_list', { name: searchText.value });
    bugList.value = data.data;
    paginationConfig.total = data.total;
};

const fetchBugTypes = async () => {
    const data = await http.post('/test/v1/bugs/get_bugtypes_list', { name: undefined });
    bugTypes.value = data.data;
};

const showCreateModal = () => {
    createModalVisible.value = true;
    createFormData.bug_name = '';
    createFormData.bug_number = '';
    createFormData.danger_level = '';
    createFormData.description = '';
    createFormData.advice = '';
    createFormData.type_name = '';
};

const showEditModal = (record) => {
    editFormData.bug_id = record.bug_id;
    editFormData.bug_name = record.bug_name;
    editFormData.bug_number = record.bug_number;
    editFormData.danger_level = record.danger_level;
    editFormData.description = record.description;
    editFormData.advice = record.advice;
    editFormData.type_name = record.type_name;
    editModalVisible.value = true;
};

const createBug = () => {
    if (!createFormData.bug_name) {
        ElMessage.error('请填写漏洞名称');
        return;
    }
    
    createForm.value.validate().then(async () => {
        await http.post('/test/v1/bugs/create_bug', createFormData);
        createModalVisible.value = false;
        fetchBugList();
    });
};

const updateBug = () => {
    if (!editFormData.bug_name) {
        ElMessage.error('请填写漏洞名称');
        return;
    }
    editForm.value.validate().then(async () => {
        await http.post('/test/v1/bugs/update_bug', editFormData);
        editModalVisible.value = false;
        fetchBugList();
    });
};

const deleteBug = async (bug_id) => {
    const confirmResult = await ElMessageBox.confirm(
        '确定要删除该漏洞吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    );

    if (confirmResult) {
        await http.post('/test/v1/bugs/delete_bug', { bug_id });
        fetchBugList();
    }
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const table_height = window.innerHeight * 0.55;

const rules = {
    bug_name: [{ required: true, message: '请填写漏洞名称', trigger: 'change' }],
};

const handleTypeChange = (value) => {
    if (createModalVisible.value) {
        createFormData.type_name = value;
    } else {
        editFormData.type_name = value;
    }
};
</script>

<style scoped>
.modal-form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}

.upload-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    height: 100px;
    cursor: pointer;
}

.upload-container:hover {
    border-color: #1890ff;
}

.upload-text {
    margin-top: 8px;
}

.el-upload__input {
    display: none;
}
</style>