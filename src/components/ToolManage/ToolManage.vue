<template>
    <div style="margin: 20px;">
        <a-page-header title="工具管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入工具名称" style="width: 200px"
                @search="fetchToolList" />
            <a-button type="primary" @click="showCreateModal"> 新增工具 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="toolList" :rowKey="record => record.tool_id"
            pagination="paginationConfig" :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="showEditModal(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="deleteTool(record.tool_id)">删除</a-button>
                </template>
                <template v-else-if="column.key === 'download_tar'">
                    <a-button type="link" @click="downloadFile(record.tool_id, file)" v-for="file in record.tar_list" :key="file">
                        下载安装包
                    </a-button>
                </template>
                <template v-else-if="column.key === 'download_doc'">
                    <a-button type="link" @click="downloadFile(record.tool_id, file)" v-for="file in record.doc_list" :key="file">
                        下载说明书
                    </a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增工具" v-model:visible="createModalVisible" @ok="createTool" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="createForm" :model="createFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="工具名称" name="tool_name">
                        <a-input v-model:value="createFormData.tool_name" />
                    </a-form-item>
                    <a-form-item label="工具版本" name="tool_version">
                        <a-input v-model:value="createFormData.tool_version" />
                    </a-form-item>
                    <a-form-item label="下载链接" name="url_path">
                        <a-input v-model:value="createFormData.url_path" />
                    </a-form-item>
                    <a-form-item label="工具描述" name="tool_description">
                        <a-textarea v-model:value="createFormData.tool_description" />
                    </a-form-item>
                    <a-form-item label="上传安装包" name="tar_list">
                        <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUploadTar" v-model:file-list="tar_list"
                            accept=".tar">
                            <template #trigger>
                                <el-button>上传文件</el-button>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <a-form-item label="上传说明书" name="doc_list">
                        <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUploadDoc" v-model:file-list="doc_list"
                            accept=".doc,.docx,.pdf">
                            <template #trigger>
                                <el-button>上传文件</el-button>
                            </template>
                        </el-upload>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>

        <a-modal title="编辑工具" v-model:visible="editModalVisible" @ok="updateTool" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="editForm" :model="editFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="工具名称" name="tool_name">
                        <a-input v-model:value="editFormData.tool_name" />
                    </a-form-item>
                    <a-form-item label="工具版本" name="tool_version">
                        <a-input v-model:value="editFormData.tool_version" />
                    </a-form-item>
                    <a-form-item label="下载链接" name="url_path">
                        <a-input v-model:value="editFormData.url_path" />
                    </a-form-item>
                    <a-form-item label="工具描述" name="tool_description">
                        <a-textarea v-model:value="editFormData.tool_description" />
                    </a-form-item>
                    <a-form-item label="上传安装包" name="tar_list">
                        <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUploadTar" v-model:file-list="tar_list"
                            accept=".tar">
                            <template #trigger>
                                <el-button>上传文件</el-button>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <a-form-item label="上传说明书" name="doc_list">
                        <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUploadDoc" v-model:file-list="doc_list"
                            accept=".doc,.docx,.pdf">
                            <template #trigger>
                                <el-button>上传文件</el-button>
                            </template>
                        </el-upload>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
import dayjs from 'dayjs';
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
console.log(baseURL)
const searchText = ref('');
const toolList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createForm = ref(null);
const editForm = ref(null);
const tar_list = ref([]);
const doc_list = ref([]);
const createFormData = reactive({
    tool_name: '',
    tool_version: '',
    url_path: '',
    tool_description: '',
    tar_list: [],
    doc_list: [],
});

const editFormData = reactive({
    tool_id: '',
    tool_name: '',
    tool_version: '',
    url_path: '',
    tool_description: '',
    tar_list: [],
    doc_list: [],
});

const columns = [
    { title: '工具ID', dataIndex: 'tool_id' },
    { title: '工具名称', dataIndex: 'tool_name' },
    { title: '工具版本', dataIndex: 'tool_version' },
    { title: '下载链接', dataIndex: 'url_path' },
    { title: '创建时间', dataIndex: 'created_time' },
    { title: '创建者', dataIndex: 'tool_creator' },
    { title: '工具描述', dataIndex: 'tool_description' },
    {
        title: '安装包',
        key: 'download_tar',
        scopedSlots: { customRender: 'download_tar' },
    },
    {
        title: '说明书',
        key: 'download_doc',
        scopedSlots: { customRender: 'download_doc' },
    },
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
        fetchToolList();
    },
});

onMounted(() => {
    fetchToolList();
});

const fetchToolList = async () => {
    const data = await http.post('/test/v1/tools/get_tools_list', { tool_name: searchText.value });
    toolList.value = data.data;
    paginationConfig.total = data.total;
};

const showCreateModal = () => {
    createModalVisible.value = true;
    createFormData.tool_name = '';
    createFormData.tool_version = '';
    createFormData.url_path = '';
    createFormData.tool_description = '';
    createFormData.tar_list = [];
    createFormData.doc_list = [];
    tar_list.value = [];
    doc_list.value = [];
};

const showEditModal = (record) => {
    editFormData.tool_id = record.tool_id;
    editFormData.tool_name = record.tool_name;
    editFormData.tool_version = record.tool_version;
    editFormData.url_path = record.url_path;
    editFormData.tool_description = record.tool_description;
    console.log(record)
    editFormData.tar_list = record.tar_list || [];
    editFormData.doc_list = record.doc_list || [];
    tar_list.value = (record.tar_list || []).map(x => {
        return {
            name: x,
            url: x,
        };
    });
    doc_list.value = (record.doc_list || []).map(x => {
        return {
            name: x,
            url: x,
        };
    })
    editModalVisible.value = true;
};

const createTool = () => {
    if (!createFormData.tool_name) {
        ElMessage.error('请填写工具名称');
        return;
    }
    
    createForm.value.validate().then(async () => {
        await http.post('/test/v1/tools/create_tool', createFormData);
        createModalVisible.value = false;
        fetchToolList();
    });
};

const updateTool = () => {
    if (!editFormData.tool_name) {
        ElMessage.error('请填写工具名称');
        return;
    }
    editForm.value.validate().then(async () => {
        await http.post('/test/v1/tools/update_tool', editFormData);
        editModalVisible.value = false;
        fetchToolList();
    });
};

const deleteTool = async (tool_id) => {
    const confirmResult = await ElMessageBox.confirm(
        '确定要删除该工具吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    );

    if (confirmResult) {
        await http.post('/test/v1/tools/delete_tool', { tool_id });
        fetchToolList();
    }
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const table_height = window.innerHeight * 0.55;

const rules = {
    tool_name: [{ required: true, message: '请填写工具名称', trigger: 'change' }],
};

const onBeforeUploadTar: UploadProps['onChange'] = async (file) => {
    const formData = new FormData();
    formData.append('info', JSON.stringify({ category: 'tar' }));
    formData.append('file', file.raw);
    try {
        const response = await http.post(`/test/v1/tools/upload_tool_file`, formData);
        if (response) {
            if (createModalVisible.value) {
                createFormData.tar_list.push(file.name);
            } else {
                editFormData.tar_list.push(file.name);
            }
        }
    } catch (error) {
        console.error("Upload failed: ", error);
    }
};

const onBeforeUploadDoc: UploadProps['onChange'] = async (file) => {
    const formData = new FormData();
    formData.append('info', JSON.stringify({ category: 'doc' }));
    formData.append('file', file.raw);
    try {
        const response = await http.post(`/test/v1/tools/upload_tool_file`, formData);
        if (response) {
            if (createModalVisible.value) {
                createFormData.doc_list.push(file.name);
            } else {
                editFormData.doc_list.push(file.name);
            }
        }
    } catch (error) {
        console.error("Upload failed: ", error);
    }
};

const downloadFile = async (tool_id, filename) => {
    const path = `${tool_id}/tar/${filename}`;
    const response = await http.post('/test/v1/common/get_file', { path });
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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