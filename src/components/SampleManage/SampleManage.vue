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
                    <a-divider type="vertical" />
                    <a-button type="link" @click="showReturnModal(record)">还样</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="showReturnRecordsModal(record)">还样记录</a-button>
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
                    <LabelSelector v-model="selectedLabels" label-group-type="sample" />
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
                    <a-form-item label="样品描述" name="sample_description">
                        <a-textarea v-model:value="editFormData.sample_description" />
                    </a-form-item>
                    <a-form-item label="样品商标" name="logo_url">
                        <el-upload ref="uploadRef" v-model:file-list="editFormData.logo_list" :auto-upload="false"
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
                    <LabelSelector v-model="selectedLabels" label-group-type="sample" />
                </div>
            </a-form>
        </a-modal>

        <a-modal title="还样" v-model:visible="returnModalVisible" @ok="handleReturnSample" @cancel="handleCancel"
            okText="确定" cancelText="取消" width="40%">
            <a-form ref="returnForm" :model="returnFormData" :rules="returnRules">
                <a-form-item label="还样日期" name="return_time">
                    <a-date-picker v-model:value="returnFormData.return_time" />
                </a-form-item>
                <a-form-item label="还样数量" name="return_quantity">
                    <a-input-number v-model:value="returnFormData.return_quantity" min="1" />
                </a-form-item>
                <a-form-item label="还样方式" name="return_method">
                    <a-input v-model:value="returnFormData.return_method" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
    <a-modal title="还样记录" v-model:visible="returnRecordsModalVisible" @cancel="handleCancel" width="60%">
        <a-table :columns="returnRecordsColumns" :dataSource="returnRecords" :rowKey="record => record.id" />
    </a-modal>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
import LabelSelector from '../LabelManage/LabelSelector.vue';
import dayjs from 'dayjs';
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
console.log(baseURL)
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
    { title: '规格型号', dataIndex: 'specificate_model' },
    { title: '样品数量', dataIndex: 'sample_sum' },
    { title: '委托方', dataIndex: 'mandator' },
    { title: '生产厂商', dataIndex: 'producer' },
    { title: '获取时间', dataIndex: 'get_time' },
    { title: '获取记录', dataIndex: 'get_record' },
    { title: '归还时间', dataIndex: 'return_time' },
    { title: '归还记录', dataIndex: 'return_record' },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        width: '18%'
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
    createFormData.sample_description = '';
    createFormData.logo_list = [];
    createFormData.pic_list = [];
};



const showEditModal = (record) => {
    selectedLabels.value = [...(record.labels || [])]
    record.pic_list = record.pic_list || [];
    editFormData.sample_name = record.sample_name;
    editFormData.old_sample_id = record.sample_id;
    editFormData.new_sample_id = record.sample_id;
    editFormData.specificate_model = record.specificate_model;
    editFormData.sample_sum = record.sample_sum;
    editFormData.mandator = record.mandator;
    editFormData.producer = record.producer;
    editFormData.get_time = dayjs(record.get_time || '2000-01-01');
    editFormData.get_record = record.get_record;
    editFormData.sample_status = record.sample_status;
    editFormData.sample_description = record.sample_description;
    logo_url.value = record.logo_url;

    editFormData.logo_list = [{
        name: baseURL + record.logo_url,
        url: baseURL + record.logo_url
    }];
    if (record.logo_url) {
        logo_url.value = baseURL + record.logo_url;
    }
    editFormData.pic_list = (record.pic_list || []).map(x => {
        return {
            name: baseURL + x,
            url: baseURL + x,
        }
    });
    picture_urls.value = record.pic_list || [];
    editModalVisible.value = true;
};

const createSample = () => {
    if (!createFormData.sample_name) {
        ElMessage.error('请填写样品名称');
        return;
    }

    createForm.value.validate().then(async () => {
        createFormData.label_list = selectedLabels.value.map(label => label.label_id);
        await http.post('/test/v1/samples/create_sample', {
            ...createFormData,
            logo_url: logo_url.value,
            pic_list: picture_urls.value,
        });
        createModalVisible.value = false;
        fetchSampleList();
    });
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
        await http.post('/test/v1/samples/update_sample', {
            ...params,
            logo_url: (logo_url.value || '').replace('/dev-api', ''),
            pic_list: (picture_urls.value || []).map(x => { return (x || '').replace('/dev-api', '') }),
            label_list: selectedLabels.value.map(label => label.label_id)
        });
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

const returnModalVisible = ref(false);
const returnForm = ref(null);
const returnFormData = reactive({
    sample_id: '',
    return_time: '',
    return_quantity: 1,
    return_method: '',
});

const returnRules = {
    return_time: [{ required: true, message: '请选择还样日期', trigger: 'change' }],
    return_quantity: [{ required: true, message: '请填写还样数量', trigger: 'change' }],
    return_method: [{ required: true, message: '请填写还样方式', trigger: 'change' }],
};

const showReturnModal = (record) => {
    returnFormData.sample_id = record.sample_id;
    returnFormData.return_time = '';
    returnFormData.return_quantity = 1;
    returnFormData.return_method = '';
    returnModalVisible.value = true;
};

const handleReturnSample = () => {
    returnForm.value.validate().then(async () => {
        await http.post('/test/v1/samples/return_sample', returnFormData);
        returnModalVisible.value = false;
        fetchSampleList();
    });
};

const returnRecordsModalVisible = ref(false);
const returnRecords = ref([]);

const returnRecordsColumns = [
    { title: '还样日期', dataIndex: 'return_time' },
    { title: '还样数量', dataIndex: 'return_quantity' },
    { title: '还样方式', dataIndex: 'return_method' },
];

const showReturnRecordsModal = async (record) => {
    const data = await http.post('/test/v1/samples/get_return_records', { id: record.sample_id });
    returnRecords.value = data.data;
    returnRecordsModalVisible.value = true;
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