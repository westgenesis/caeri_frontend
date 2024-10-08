<template>
    <div style="margin: 20px;">
        <a-page-header title="组织管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="输入组织名称" style="width: 200px"
                @search="fetchGroupList" />
            <a-button type="primary" @click="showCreateModal"> 添加分组 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="pagedGroupList" :rowKey="record => record.group_id"
            :pagination="paginationConfig" :scroll="{ y: table_height}">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'group_id'">
                    {{ record.group_id }}
                </template>
                <template v-if="column.key === 'group_name'">
                    {{ record.group_name }}
                </template>
                <template v-if="column.key === 'group_level'">
                    {{ record.group_level }}
                </template>
                <template v-if="column.key === 'parent_group_id'">
                    {{ record.parent_group_id }}
                </template>
                <template v-if="column.key === 'user_status'">
                    {{ record.user_status ? '启用' : '禁用' }}
                </template>
                <template v-if="column.key === 'created_time'">
                    {{ record.created_time }}
                </template>
                <template v-if="column.key === 'users'">
                    {{ record.users.map(user => user.user_name).join(', ') }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="deleteGroup(record.group_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增分组" v-model:visible="createModalVisible" @ok="createGroup" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="createForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
                <a-form-item label="分组名称" name="name">
                    <a-input v-model:value="createFormData.name" />
                </a-form-item>
                <a-form-item label="上级组织" name="parent_group_id">
                    <a-select v-model:value="createFormData.parent_group_id" allow-clear>
                        <a-select-option v-for="group in groupList" :key="group.group_id" :value="group.group_id">
                            {{ group.group_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="成员" name="users">
                    <a-transfer :dataSource="userOptions" :targetKeys="createFormData.users"
                        :render="item => item.title" @change="handleTransferChange" />
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal title="编辑分组" v-model:visible="editModalVisible" @ok="updateGroup" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
                <a-form-item label="分组名称" name="name">
                    <a-input v-model:value="editFormData.name" />
                </a-form-item>
                <a-form-item label="上级组织" name="parent_group_id">
                    <a-select v-model:value="editFormData.parent_group_id" allow-clear>
                        <a-select-option v-for="group in groupList" :key="group.group_id" :value="group.group_id">
                            {{ group.group_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="成员" name="users">
                    <a-transfer :dataSource="userOptions" :targetKeys="editFormData.users" :render="item => item.title"
                        @change="handleTransferChange" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox } from 'element-plus';


const searchText = ref('');
const groupList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createFormData = reactive({ name: '', parent_group_id: null, users: [] });
const editFormData = reactive({ group_id: '', name: '', parent_group_id: null, users: [] });
const userOptions = ref([]);
const groupListFiltered = ref([]);
const table_height = window.innerHeight * 0.55;

const columns = [
    { title: '序号', dataIndex: 'group_id', key: 'group_id' },
    { title: '分组名称', dataIndex: 'group_name', key: 'group_name' },
    { title: '上级组织ID', dataIndex: 'parent_group_id', key: 'parent_group_id' },
    { title: '组织状态', dataIndex: 'user_status', key: 'user_status' },
    { title: '创建时间', dataIndex: 'created_time', key: 'created_time' },
    { title: '组织成员', dataIndex: 'users', key: 'users' },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

const paginationConfig = reactive({
    total: 0,
    pageSize: 10,
    current: 1,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条`,
    onChange: (page) => {
        paginationConfig.current = page;
    },
});

const fetchGroupList = async () => {
    const { data } = await http.post('/test/v1/users/get_group_list', { name: searchText.value || undefined });
    groupList.value = data;
    paginationConfig.total = data.length;
};

const pagedGroupList = computed(() => {
    const start = (paginationConfig.current - 1) * paginationConfig.pageSize;
    const end = start + paginationConfig.pageSize;
    return groupList.value.slice(start, end);
});

const fetchUserList = async () => {
    const { data } = await http.post('/test/v1/users/get_user_list', {});
    userOptions.value = data.map(user => ({ key: user.user_id, title: user.user_name }));
};

const showCreateModal = () => {
    createModalVisible.value = true;
    Object.assign(createFormData, { name: '', parent_group_id: null, users: [] });
};

const createGroup = async () => {
    await http.post('/test/v1/users/create_group', createFormData);
    createModalVisible.value = false;
    fetchGroupList();
};

const showEditModal = (record) => {
    editFormData.group_id = record.group_id;
    editFormData.name = record.group_name;
    editFormData.parent_group_id = record.parent_group_id;
    editFormData.users = record.users.map(user => user.user_id);
    editModalVisible.value = true;
};

const updateGroup = async () => {
    if (editFormData.group_id === editFormData.parent_group_id) {
        ElMessage.error('上级组织不能是当前组织本身!');
        return;
    }
    await http.post('/test/v1/users/update_group', editFormData);
    editModalVisible.value = false;
    fetchGroupList();
};

const deleteGroup = async (group_id) => {
    await http.post('/test/v1/users/delete_group', { group_id });
    fetchGroupList();
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

const handleTransferChange = (nextTargetKeys) => {
    createFormData.users = nextTargetKeys;
    editFormData.users = nextTargetKeys;
};

onMounted(() => {
    fetchGroupList();
    fetchUserList();
});
</script>

<style scoped></style>