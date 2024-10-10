<template>
    <div style="margin: 20px;">
        <a-page-header title="漏洞类型管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入漏洞类型名称" style="width: 200px"
                @search="fetchBugTypeList" />
            <a-button type="primary" @click="showCreateModal"> 新增漏洞类型 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="bugTypeList" :rowKey="record => record.type_id"
            pagination="paginationConfig" :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="showEditModal(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="deleteBugType(record.type_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增漏洞类型" v-model:visible="createModalVisible" @ok="createBugType" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="createForm" :model="createFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="漏洞类型名称" name="type_name">
                        <a-input v-model:value="createFormData.type_name" />
                    </a-form-item>
                    <a-form-item label="漏洞类型描述" name="description">
                        <a-textarea v-model:value="createFormData.description" />
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>

        <a-modal title="编辑漏洞类型" v-model:visible="editModalVisible" @ok="updateBugType" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="editForm" :model="editFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="漏洞类型名称" name="type_name">
                        <a-input v-model:value="editFormData.type_name" />
                    </a-form-item>
                    <a-form-item label="漏洞类型描述" name="description">
                        <a-textarea v-model:value="editFormData.description" />
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
const bugTypeList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createForm = ref(null);
const editForm = ref(null);

const createFormData = reactive({
    type_name: '',
    description: '',
});

const editFormData = reactive({
    type_id: '',
    type_name: '',
    description: '',
});

const columns = [
    { title: '漏洞类型ID', dataIndex: 'type_id' },
    { title: '漏洞类型名称', dataIndex: 'type_name' },
    { title: '漏洞类型描述', dataIndex: 'description' },
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
        fetchBugTypeList();
    },
});

onMounted(() => {
    fetchBugTypeList();
});

const fetchBugTypeList = async () => {
    const data = await http.post('/test/v1/bugs/get_bugtypes_list', { name: searchText.value });
    bugTypeList.value = data.data;
    paginationConfig.total = data.total;
};

const showCreateModal = () => {
    createModalVisible.value = true;
    createFormData.type_name = '';
    createFormData.description = '';
};

const showEditModal = (record) => {
    editFormData.type_id = record.type_id;
    editFormData.type_name = record.type_name;
    editFormData.description = record.description;
    editModalVisible.value = true;
};

const createBugType = () => {
    if (!createFormData.type_name) {
        ElMessage.error('请填写漏洞类型名称');
        return;
    }
    
    createForm.value.validate().then(async () => {
        await http.post('/test/v1/bugs/create_bugtype', createFormData);
        createModalVisible.value = false;
        fetchBugTypeList();
    });
};

const updateBugType = () => {
    if (!editFormData.type_name) {
        ElMessage.error('请填写漏洞类型名称');
        return;
    }
    editForm.value.validate().then(async () => {
        await http.post('/test/v1/bugs/update_bugtype', editFormData);
        editModalVisible.value = false;
        fetchBugTypeList();
    });
};

const deleteBugType = async (type_id) => {
    const confirmResult = await ElMessageBox.confirm(
        '确定要删除该漏洞类型吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    );

    if (confirmResult) {
        await http.post('/test/v1/bugs/delete_bugtype', { type_id });
        fetchBugTypeList();
    }
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const table_height = window.innerHeight * 0.55;

const rules = {
    type_name: [{ required: true, message: '请填写漏洞类型名称', trigger: 'change' }],
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