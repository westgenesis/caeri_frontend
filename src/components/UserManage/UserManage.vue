<template>
    <div style="margin: 20px;">
        <a-page-header title="用户管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model="searchText" placeholder="请输入用户名" style="width: 200px" @search="fetchUserList" />
            <a-button type="primary" @click="showCreateModal"> 新增用户 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="userList" :rowKey="record => record.user_id" pagination="paginationConfig">
            <template #action="{ text, record }">
                <a @click="showEditModal(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="deleteUser(record.user_id)" style="color: red;">删除</a>
            </template>
        </a-table>

        <a-modal title="新增用户" v-model:visible="createModalVisible" @ok="createUser" @cancel="handleCancel">
            <a-form :form="createForm">
                <a-form-item label="用户名" name="name">
                    <a-input v-model="createFormData.name" />
                </a-form-item>
                <a-form-item label="账号" name="account">
                    <a-input v-model="createFormData.account" />
                </a-form-item>
                <a-form-item label="密码" name="password">
                    <a-input type="password" v-model="createFormData.password" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model="createFormData.email" />
                </a-form-item>
                <a-form-item label="角色" name="user_role_id">
                    <a-select v-model="createFormData.user_role_id" :options="rolesOptions" />
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal title="编辑用户" v-model:visible="editModalVisible" @ok="updateUser" @cancel="handleCancel">
            <a-form :form="editForm">
                <a-form-item label="用户名" name="name">
                    <a-input v-model="editFormData.name" />
                </a-form-item>
                <a-form-item label="账号" name="account">
                    <a-input v-model="editFormData.account" />
                </a-form-item>
                <a-form-item label="密码" name="password">
                    <a-input type="password" v-model="editFormData.password" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model="editFormData.email" />
                </a-form-item>
                <a-form-item label="角色" name="user_role_id">
                    <a-select v-model="editFormData.user_role_id" :options="rolesOptions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage } from 'element-plus';

export default {
    setup() {
        const searchText = ref('');
        const userList = ref([]);
        const createModalVisible = ref(false);
        const editModalVisible = ref(false);
        const rolesOptions = ref([]);
        const createFormData = reactive({ name: '', account: '', password: '', email: '', user_role_id: '' });
        const editFormData = reactive({ user_id: '', name: '', account: '', password: '', email: '', user_role_id: '' });

        const columns = [
            { title: '用户序号', dataIndex: 'user_id' },
            { title: '用户名', dataIndex: 'user_name' },
            { title: '角色类型', dataIndex: 'role_name' },
            { title: '账号状态', dataIndex: 'user_status', scopedSlots: { customRender: 'user_status' } },
            { title: '备注', dataIndex: 'comment' },
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
                fetchUserList();
            },
        });

        onMounted(() => {
            fetchUserList();
            fetchRoles();
        });

        const fetchUserList = async () => {
            const { data } = await http.post('/test/v1/users/get_user_list', { name: searchText.value || undefined });
            userList.value = data.items;
            paginationConfig.total = data.total;
        };

        const fetchRoles = async () => {
            // 假设有一个接口可以获取角色列表，用于选择用户角色
            const { data } = await http.post('/test/v1/users/get_role_list');
            rolesOptions.value = data.map(role => ({ label: role.role_name, value: role.role_id }));
        };

        const showCreateModal = () => {
            createModalVisible.value = true;
        };

        const createUser = async () => {
            await http.post('/test/v1/users/create_user', createFormData);
            createModalVisible.value = false;
            fetchUserList();
        };

        const showEditModal = (record) => {
            editFormData.user_id = record.user_id;
            editFormData.name = record.user_name;
            editFormData.account = record.account;
            editFormData.password = '';
            editFormData.email = record.email;
            editFormData.user_role_id = record.user_role_id;
            editModalVisible.value = true;
        };

        const updateUser = async () => {
            await http.post('/test/v1/users/update_user', editFormData);
            editModalVisible.value = false;
            fetchUserList();
        };

        const deleteUser = async (user_id) => {
            await http.post('/test/v1/users/delete_user', { user_id });
            fetchUserList();
        };

        const handleCancel = () => {
            createModalVisible.value = false;
            editModalVisible.value = false;
        };

        return {
            searchText,
            userList,
            createModalVisible,
            editModalVisible,
            createFormData,
            editFormData,
            rolesOptions,
            columns,
            paginationConfig,
            fetchUserList,
            showCreateModal,
            createUser,
            showEditModal,
            updateUser,
            deleteUser,
            handleCancel,
        };
    },
};
</script>

<style scoped>
/* 这里加上你需要的样式 */
</style>