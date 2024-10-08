<template>
    <div style="margin: 20px;">
        <a-page-header title="样品管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入样品名称" style="width: 200px"
                @search="fetchSampleList" />
            <a-button type="primary" @click="showCreateModal"> 新增样品 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="sampleList" :rowKey="record => record.sample_id"
            pagination="paginationConfig" :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="showEditModal(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="deleteSample(record.sample_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增样品" v-model:visible="createModalVisible" @ok="createSample" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="createForm" :model="createFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="样品编号" name="sample_id">
                        <a-input v-model:value="createFormData.sample_id" />
                    </a-form-item>
                    <a-form-item label="样品名称" name="sample_name">
                        <a-input v-model:value="createFormData.sample_name" />
                    </a-form-item>
                    <a-form-item label="规格型号" name="specificate_model">
                        <a-input v-model:value="createFormData.specificate_model" />
                    </a-form-item>
                    <a-form-item label="样品数量" name="sample_sum">
                        <a-input-number v-model:value="createFormData.sample_sum" min="1" />
                    </a-form-item>
                    <a-form-item label="委托单位" name="mandator">
                        <a-input v-model:value="createFormData.mandator" />
                    </a-form-item>
                    <a-form-item label="生产单位" name="producer">
                        <a-input v-model:value="createFormData.producer" />
                    </a-form-item>
                    <a-form-item label="送样日期" name="get_time">
                        <a-date-picker v-model:value="createFormData.get_time" @change="createChangeGetTime" />
                    </a-form-item>
                    <a-form-item label="送样记录" name="get_record">
                        <a-input v-model:value="createFormData.get_record" />
                    </a-form-item>
                    <a-form-item label="样品描述" name="sample_description">
                        <a-textarea v-model:value="createFormData.sample_description" />
                    </a-form-item>
                    <a-form-item label="样品商标" name="logo_url">
                        <el-upload ref="uploadRef" v-model:file-list="createFormData.logo_list" :auto-upload="false"
                            :on-change="onBeforeUploadLogo" accept=".jpg,.png" listType="picture-card"
                            :on-preview="handlePictureCardPreview" limit="1">
                            <template #trigger>
                                <div>
                                    <plus-outlined />
                                    <div style="margin-top: 8px">Upload</div>
                                </div>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <a-form-item label="上传样品图片" name="pic_list">
                        <el-upload ref="uploadRef" v-model:file-list="createFormData.pic_list" :auto-upload="false"
                            :on-change="onBeforeUpload" accept=".jpg,.png" listType="picture-card"
                            :on-preview="handlePictureCardPreview">
                            <template #trigger>
                                <div>
                                    <plus-outlined />
                                    <div style="margin-top: 8px">Upload</div>
                                </div>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <LabelSelector v-model="selectedLabels" label-group-type="client" />
                    <a-form-item label="备注" name="remark">
                        <a-textarea v-model:value="createFormData.remark" />
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>

        <a-modal title="编辑样品" v-model:visible="editModalVisible" @ok="updateSample" @cancel="handleCancel" okText="确定"
            cancelText="取消" width="60%">
            <a-form ref="editForm" :model="editFormData" :rules="rules">
                <div class="modal-form-grid">
                    <a-form-item label="样品编号" name="sample_id">
                        <a-input v-model:value="editFormData.new_sample_id" />
                    </a-form-item>
                    <a-form-item label="样品名称" name="sample_name">
                        <a-input v-model:value="editFormData.sample_name" />
                    </a-form-item>
                    <a-form-item label="规格型号" name="specificate_model">
                        <a-input v-model:value="editFormData.specificate_model" />
                    </a-form-item>
                    <a-form-item label="样品数量" name="sample_sum">
                        <a-input-number v-model:value="editFormData.sample_sum" min="1" />
                    </a-form-item>
                    <a-form-item label="委托单位" name="mandator">
                        <a-input v-model:value="editFormData.mandator" />
                    </a-form-item>
                    <a-form-item label="生产单位" name="producer">
                        <a-input v-model:value="editFormData.producer" />
                    </a-form-item>
                    <a-form-item label="获取时间" name="get_time">
                        <a-date-picker v-model:value="editFormData.get_time" />
                    </a-form-item>
                    <a-form-item label="获取记录" name="get_record">
                        <a-input v-model:value="editFormData.get_record" />
                    </a-form-item>
                    <a-form-item label="样品状态" name="sample_status">
                        <a-input v-model:value="editFormData.sample_status" />
                    </a-form-item>
                    <a-form-item label="样品描述" name="sample_description">
                        <a-textarea v-model:value="editFormData.sample_description" />
                    </a-form-item>
                    <a-form-item label="样品商标" name="logo_url">
                        <el-upload ref="uploadRef" v-model:file-list="editFormData.logo_list" :auto-upload="false"
                            :on-change="onBeforeUploadLogo" accept=".jpg,.png" listType="picture-card"
                            :on-preview="handlePictureCardPreview">
                            <template #trigger>
                                <div>
                                    <plus-outlined />
                                    <div style="margin-top: 8px">Upload</div>
                                </div>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <a-form-item label="图片列表" name="pic_list">

                        <el-upload ref="uploadRef" v-model:file-list="editFormData.pic_list" :auto-upload="false"
                            :on-change="onBeforeUpload" accept=".jpg,.png" listType="picture-card"
                            :on-preview="handlePictureCardPreview">
                            <template #trigger>
                                <div>
                                    <plus-outlined />
                                    <div style="margin-top: 8px">Upload</div>
                                </div>
                            </template>
                        </el-upload>
                    </a-form-item>
                    <LabelSelector v-model="selectedLabels" label-group-type="client" />
                    <a-form-item label="备注" name="remark">
                        <a-textarea v-model:value="editFormData.remark" />
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>
    </div>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
import LabelSelector from '../LabelManage/LabelSelector.vue';

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const searchText = ref('');
const sampleList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createForm = ref(null);
const editForm = ref(null);
const selectedLabels = ref([]);
const logo_url = ref('');
const picture_urls = ref([]);
const fileList = ref([]);
const currentLogo = ref({});
const createFormData = reactive({
    sample_name: '',
    sample_id: '',
    specificate_model: '',
    sample_sum: 1,
    mandator: '',
    producer: '',
    get_time: '',
    get_record: '',
    return_time: '',
    return_record: '',
    sample_status: '',
    sample_description: '',
    logo_list: [],
    pic_list: [],
    label_list: [],
    get_time_str: '',
    return_time_str: '',
});

const editFormData = reactive({
    sample_name: '',
    old_sample_id: '',
    new_sample_id: '',
    specificate_model: '',
    sample_sum: 1,
    mandator: '',
    producer: '',
    get_time: '',
    get_record: '',
    return_time: '',
    return_record: '',
    sample_status: '',
    sample_description: '',
    logo_list: [],
    pic_list: [],
    label_list: [],
    get_time_str: '',
    return_time_str: '',
});

const createChangeGetTime = (e, str) => {
    createFormData.get_time_str = str;
}

const createChangeReturnTime = (e, str) => {
    createFormData.return_time_str = str;
}

const columns = [
    { title: '样品编号', dataIndex: 'sample_id' },
    { title: '样品名称', dataIndex: 'sample_name' },
    { title: '创建者', dataIndex: 'creator' },
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
        fetchSampleList();
    },
});

onMounted(() => {
    fetchSampleList();
});

const fetchSampleList = async () => {
    const data = await http.post('/test/v1/samples/get_sample_list', { sample_name: searchText.value });
    sampleList.value = data.data;
    paginationConfig.total = data.total;
};

const showCreateModal = () => {
    createModalVisible.value = true;
    selectedLabels.value = [];
    createFormData.sample_name = '';
    createFormData.sample_id = '';
    createFormData.specificate_model = '';
    createFormData.sample_sum = 1;
    createFormData.mandator = '';
    createFormData.producer = '';
    createFormData.get_time = '';
    createFormData.get_record = '';
    createFormData.return_time = '';
    createFormData.return_record = '';
    createFormData.sample_status = '';
    createFormData.sample_description = '';
    createFormData.logo_list = [];
    createFormData.pic_list = [];
};

const createSample = () => {
    if (!createFormData.sample_name) {
        ElMessage.error('请填写样品名称');
        return;
    }
    console.log(createFormData);
    
    createForm.value.validate().then(async () => {
        await http.post('/test/v1/samples/create_sample', {
            ...createFormData,
            logo_url: logo_url.value,
            pic_list: picture_urls.value,
        });
        createModalVisible.value = false;
        fetchSampleList();
    });
};

const showEditModal = (record) => {
    selectedLabels.value = [...record.labels]
    editFormData.sample_name = record.sample_name;
    editFormData.old_sample_id = record.sample_id;
    editFormData.new_sample_id = record.sample_id;
    editFormData.specificate_model = record.specificate_model;
    editFormData.sample_sum = record.sample_sum;
    editFormData.mandator = record.mandator;
    editFormData.producer = record.producer;
    editFormData.get_time = record.get_time;
    editFormData.get_record = record.get_record;
    editFormData.return_time = record.return_time;
    editFormData.return_record = record.return_record;
    editFormData.sample_status = record.sample_status;
    editFormData.sample_description = record.sample_description;
    editFormData.logo_list = record.logo_list;
    editFormData.pic_list = record.pic_list;
    editModalVisible.value = true;
};

const updateSample = () => {
    if (!editFormData.sample_name) {
        ElMessage.error('请填写样品名称');
        return;
    }
    editForm.value.validate().then(async () => {
        const params = { ...editFormData }
        if (params.old_sample_id === params.new_sample_id) {
            delete params.new_sample_id
        }
        await http.post('/test/v1/samples/update_sample', editFormData);
        editModalVisible.value = false;
        fetchSampleList();
    });
};

const deleteSample = async (sample_id) => {
    const confirmResult = await ElMessageBox.confirm(
        '确定要删除该样品吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    );

    if (confirmResult) {
        await http.post('/test/v1/samples/delete_sample', { sample_id });
        fetchSampleList();
    }
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const table_height = window.innerHeight * 0.55;

const rules = {
    sample_name: [{ required: true, message: '请填写样品名称', trigger: 'change' }],
};

const onBeforeUpload: UploadProps['onChange'] = async (file) => {
    const formData = new FormData();

    // 将 info 作为字符串附加到 FormData 中
    formData.append('info', JSON.stringify({ category: 'picture' }));

    // 将文件附加到 FormData 中，使用后端期望的参数名 'file'
    formData.append('pic', file.raw);
    console.log(file)
    try {
        const response = await http.post(`/test/v1/samples/upload_sample_pic`, formData);
        if (response.picture_url) {
            picture_urls.value.push(response.picture_url)
        }
    } catch (error) {
        console.error("Upload failed: ", error);
    }
};

const onBeforeUploadLogo = async (file) => {
    if (createFormData.logo_list?.length >= 1) {
        ElMessage.error('只能上传一张logo');
        return;
    }
    const formData = new FormData();

    // 将 info 作为字符串附加到 FormData 中
    formData.append('info', JSON.stringify({ category: 'logo' }));

    // 将文件附加到 FormData 中，使用后端期望的参数名 'file'
    formData.append('pic', file.raw);
    try {
        const response = await http.post(`/test/v1/samples/upload_sample_pic`, formData);
        console.log(response.picture_url)
        if (response.picture_url) {
            logo_url.value = response.picture_url
        }
    } catch (error) {
        console.error("Upload failed: ", error);
    }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
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