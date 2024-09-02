<template>
    <div style="margin: 20px;">
        <a-page-header title="用户管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入用户名" style="width: 200px"
                @search="fetchUserList" />
            <a-button type="primary" @click="showCreateModal"> 新增用户 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="userList" :rowKey="record => record.user_id"
            pagination="paginationConfig" :scroll="{ y: table_height}">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="showEditModal(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-button type="link" @click="deleteUser(record.user_id)">删除</a-button>
                </template>
                <template v-if="column.key === 'user_status'">
                    <a-tag>{{ record.user_status ? '启用' : '禁用' }}</a-tag>
                </template>
            </template>
        </a-table>

        <a-modal title="新增用户" v-model:visible="createModalVisible" @ok="createUser" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="createForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
                <a-form-item label="用户名" name="name">
                    <a-input v-model:value="createFormData.name" />
                </a-form-item>
                <a-form-item label="账号" name="account">
                    <a-input v-model:value="createFormData.account" />
                </a-form-item>
                <a-form-item label="密码" name="passwd">
                    <a-input v-model:value="createFormData.passwd" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value="createFormData.email" />
                </a-form-item>
                <a-form-item label="角色" name="user_role_id">
                    <a-select v-model:value="createFormData.user_role_id" :options="rolesOptions" />
                </a-form-item>
                <a-form-item label="备注" name="comment">
                    <a-input v-model:value="createFormData.comment" />
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal title="编辑用户" v-model:visible="editModalVisible" @ok="updateUser" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
                <a-form-item label="用户名" name="name">
                    <a-input v-model:value="editFormData.name" />
                </a-form-item>
                <a-form-item label="账号" name="account">
                    <a-input v-model:value="editFormData.account" />
                </a-form-item>
                <a-form-item label="密码" name="passwd">
                    <a-input v-model:value="editFormData.passwd" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value="editFormData.email" />
                </a-form-item>
                <a-form-item label="角色" name="user_role_id">
                    <a-select v-model:value="editFormData.user_role_id" :options="rolesOptions" />
                </a-form-item>
                <a-form-item label="备注" name="comment">
                    <a-input v-model:value="editFormData.comment" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    setup() {
        const searchText = ref('');
        const userList = ref([]);
        const createModalVisible = ref(false);
        const editModalVisible = ref(false);
        const rolesOptions = ref([]);
        const createFormData = reactive({ name: '', account: '', passwd: '', email: '', user_role_id: '', comment: '' });
        const editFormData = reactive({ user_id: '', name: '', account: '', passwd: '', email: '', user_role_id: '', comment: '' });

        const columns = [
            { title: '用户序号', dataIndex: 'user_id' },
            { title: '用户名', dataIndex: 'user_name' },
            { title: '账号状态', dataIndex: 'user_status', key: 'user_status' },
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
            const { data } = await http.post('/test/v1/users/get_user_list', { name: undefined });
            userList.value = data;
            paginationConfig.total = data.total;
        };

        const fetchRoles = async () => {
            // 假设有一个接口可以获取角色列表，用于选择用户角色
            const { data } = await http.post('/test/v1/users/get_role_list', {});
            rolesOptions.value = data.map(role => ({ label: role.role_name, value: role.role_id }));
        };

        const showCreateModal = () => {
            createModalVisible.value = true;
            createFormData.name = '';
            createFormData.account = '';
            createFormData.passwd = '';
            createFormData.email = '';
            createFormData.user_role_id = '';
            createFormData.comment = '';
        };

        const createUser = async () => {
            if (!createFormData.name) {
                ElMessage.error('请填写用户名');
                return;
            }
            if (!createFormData.account) {
                ElMessage.error('请填写账号');
                return;
            }
            if (!createFormData.passwd) {
                ElMessage.error('请填写密码');
                return;
            }
            if (!createFormData.email) {
                ElMessage.error('请填写邮箱');
                return;
            }
            if (!createFormData.user_role_id) {
                ElMessage.error('请选择角色');
                return;
            }
            await http.post('/test/v1/users/create_user', createFormData);
            createModalVisible.value = false;
            fetchUserList();
        };

        const showEditModal = (record) => {
            editFormData.user_id = record.user_id;
            editFormData.name = record.user_name;
            editFormData.account = record.account;
            editFormData.passwd = '';
            editFormData.email = record.email;
            editFormData.user_role_id = record.user_role_id;
            editFormData.comment = record.comment;
            editModalVisible.value = true;
        };

        const updateUser = async () => {
            if (!editFormData.name) {
                ElMessage.error('请填写用户名');
                return;
            }
            if (!editFormData.account) {
                ElMessage.error('请填写账号');
                return;
            }
            if (!editFormData.passwd) {
                ElMessage.error('请填写密码');
                return;
            }
            if (!editFormData.email) {
                ElMessage.error('请填写邮箱');
                return;
            }
            if (!editFormData.user_role_id) {
                ElMessage.error('请选择角色');
                return;
            }
            await http.post('/test/v1/users/update_user', editFormData);
            editModalVisible.value = false;
            fetchUserList();
        };

        const deleteUser = async (user_id) => {
            const confirmResult = await ElMessageBox.confirm(
                '确定要删除该用户吗？',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            );

            if (confirmResult) {
                await http.post('/test/v1/users/delete_user', { user_id });
                fetchUserList();
            }
        };

        const handleCancel = () => {
            createModalVisible.value = false;
            editModalVisible.value = false;
        };

        const table_height = window.innerHeight * 0.55;

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
            table_height,
        };
    },
};
</script>

<style scoped></style>