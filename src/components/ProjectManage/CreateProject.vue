<template>
    <div style="margin: 1.25rem">
        <p>创建项目</p>
        <a-form :form="createForm" layout="horizontal" :model="createFormData">
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="项目名称" required>
                        <a-input v-model:value="createFormData.project_name" style="width: 16.5rem;" />
                    </a-form-item>
                </a-col>

                <a-col :span="12">
                    <a-form-item label="项目经理" required>
                        <a-select v-model:value="createFormData.manager_id" style="width: 16.5rem;" show-search :filter-option="filterOption">
                            <a-select-option v-for="user in userList" :key="user.user_name" :value="user.user_id">{{
                                user.user_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="项目描述" name="comment">
                        <a-textarea v-model:value="createFormData.comment" style="width: 16.5rem;" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="项目编码" name="project_number">
                        <a-input v-model:value="createFormData.project_number" style="width: 16.5rem;" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="项目成员" name="member_ids">
                        <a-select v-model:value="createFormData.member_ids" mode="multiple" style="width: 16.5rem;" show-search :filter-option="filterOption">
                            <a-select-option v-for="user in userList" :key="user.user_name" :value="user.user_id">{{
                                user.user_name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="客户信息" name="customer_id">
                        <a-select v-model:value="createFormData.customer_id" style="width: 16.5rem;">
                            <a-select-option v-for="customer in customerList" :key="customer.customer_id"
                                :value="customer.customer_id">{{ customer.name }}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :span="12">
                    <a-form-item label="项目计划周期" name="period" required>
                        <a-range-picker @change="changePeriod" v-model:value="createFormData.period" style="width: 16.5rem;" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="项目优先级" name="priority">
                        <a-radio-group v-model:value="createFormData.priority" button-style="solid">
                            <a-radio-button value="high">高</a-radio-button>
                            <a-radio-button value="medium">中</a-radio-button>
                            <a-radio-button value="low">低</a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item label="项目知识库" name="file_list">
                    <el-upload ref="uploadRef" :auto-upload="false" :on-change="onBeforeUpload"
                        accept=".doc,.docx,.pdf,.xlsx,.png"
                        v-model:file-list="fileList"    
                    >
                        <template #trigger>
                            <el-button>
                                上传文件
                            </el-button>
                        </template>
                    </el-upload>
            </a-form-item>
            <div class="flex justify-center">
                <a-button type="primary" @click="createProject">创建项目</a-button>
                <a-button @click="returnToProject" style="margin-left: 1rem">取消</a-button>
            </div>

        </a-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { http } from '../../http';
import { useRouter } from 'vue-router';

const router = useRouter();

const createForm = reactive({});
const createFormData = reactive({
    project_name: '',
    project_number: '',
    comment: '',
    manager_id: '',
    member_ids: [],
    customer_id: '',
    period: [],
    period_start: '',
    period_end: '',
    priority: 'high',
    files: [],
    file_list: [] as string[],

});

const userList = ref([]);
const customerList = ref([]);
const fileList = ref([]);
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
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

const handleFileUpload = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
        for (let i = 0; i < files.length; i++) {
            createFormData.files.push(files[i]);
            createFormData.file_list.push(files[i].name);
        }
    }
};

const changePeriod = (v, strs) => {
    if (!strs?.length) {
        return;
    }
    console.log(strs);
    createFormData.period_start = strs[0];
    createFormData.period_end = strs[1];
}

const createProject = async () => {
    if (!createFormData.project_name) {
        ElMessage.error('请输入项目名称');
        return;
    }
    if (!createFormData.manager_id) {
        ElMessage.error('请选择项目经理');
        return;
    }

    if (!createFormData.period_end || !createFormData.period_start) {
        ElMessage.error('请选择项目计划周期');
        return;
    }
    const params = {
        ...createFormData,
        file_list: fileList.value.map(x => x.name)
    }

    try {
        await http.post('/test/v1/projects/create_projects', params);
        ElMessage.success('创建项目成功');
        router.push('/projectManage');
    } catch (error) {
        ElMessage.error('创建项目失败');
    }
};

const returnToProject = async () => {
    router.push('/projectManage');
}

onMounted(() => {
    fetchUserList();
    fetchCustomerList();
});

const onBeforeUpload: UploadProps['onChange'] = async (file) => {
  const formData = new FormData();
  
  // 将 info 作为字符串附加到 FormData 中
  formData.append('info', JSON.stringify({ category: 'knowledges' }));
  
  // 将文件附加到 FormData 中，使用后端期望的参数名 'file'
  formData.append('file', file.raw);
  try {
    const response = await http.post(`/test/v1/projects/upload_project_file`, formData);
  } catch (error) {
    console.error("Upload failed: ", error);
  }
};
</script>

<style scoped lang="less">
.ant-form-item {
    margin-bottom: 16px;
}

:deep {
    .ant-form-item-label {
        min-width: 10rem;
    }
}

:deep(.el-upload__input) {
    display: none !important;
}
</style>