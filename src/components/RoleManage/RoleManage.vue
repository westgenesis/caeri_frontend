<template>
    <div>
        <a-page-header title="角色管理" />
        <a-input-search v-model="searchText" placeholder="请输入角色名" style="width: 200px" @search="fetchRoleList" />
        <a-button type="primary" @click="showCreateModal"> 新增角色 </a-button>

        <a-table :columns="columns" :dataSource="roleList" :rowKey="record => record.id" pagination="paginationConfig">
            <template #action="{ text, record }">
                <a @click="showEditModal(record)">编辑</a>
                <a-divider type="vertical" />
                <a @click="deleteRole(record.id)" style="color: red;">删除</a>
            </template>
        </a-table>

        <a-modal title="新增角色" v-model:visible="createModalVisible" @ok="createRole" @cancel="handleCancel">
            <a-form :form="createForm">
                <a-form-item label="角色名" name="name">
                    <a-input v-model:value="createFormData.name" />
                </a-form-item>
                <a-form-item label="权限" name="permission">
                    <a-tree checkable :treeData="menuPermissions" :defaultExpandedKeys="expandedKeys"
                        :checkedKeys="createCheckedKeys" @check="onCreateCheck" />
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal title="编辑角色" v-model:visible="editModalVisible" @ok="updateRole" @cancel="handleCancel">
            <a-form :form="editForm">
                <a-form-item label="角色名" name="name">
                    <a-input v-model="editFormData.name" />
                </a-form-item>
                <a-form-item label="权限" name="permission">
                    <a-tree checkable :treeData="menuPermissions" :defaultExpandedKeys="expandedKeys"
                        :checkedKeys="editCheckedKeys" @check="onEditCheck" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';

export const menuPermissions = [
    {
        title: '工作台',
        key: '/home',
        children: [],
    },
    {
        title: '系统管理',
        key: '/systemManage',
        children: [
            {
                title: '角色管理',
                key: '/roleManage',
                children: [],
            },
            {
                title: '用户管理',
                key: '/userManage',
                children: [],
            },
            {
                title: '用户组织',
                key: '/userOrganization',
                children: [],
            },
            {
                title: '客户信息管理',
                key: '/customerManage',
                children: [],
            },
        ],
    },
];

export default {
    setup() {
        const searchText = ref('');
        const roleList = ref([]);
        const createModalVisible = ref(false);
        const editModalVisible = ref(false);
        const createFormData = reactive({ name: '', permission: '' });
        const editFormData = reactive({ id: '', name: '', permission: '' });
        const createCheckedKeys = ref([]);
        const editCheckedKeys = ref([]);
        const expandedKeys = ref(menuPermissions.map(item => item.key));

        const columns = [
            { title: '角色序号', dataIndex: 'index' },
            { title: '角色名称', dataIndex: 'name' },
            { title: '当前用户', dataIndex: 'current_users' },
            { title: '角色状态', dataIndex: 'status' },
            { title: '备注', dataIndex: 'remark' },
            { title: '创建时间', dataIndex: 'created_at' },
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
                fetchRoleList();
            },
        });

        onMounted(() => {
            fetchRoleList();
        });

        const fetchRoleList = async () => {
            const { data } = await http.post('/test/v1/users/get_role_list', { name: searchText.value || undefined });
            roleList.value = data;
        };

        const showCreateModal = () => {
            createModalVisible.value = true;
        };

        const createRole = async () => {
            createFormData.permission = JSON.stringify(getSelectedPermissions(createCheckedKeys.value));
            await http.post('/test/v1/users/create_role', createFormData);
            createModalVisible.value = false;
            fetchRoleList();
        };

        const showEditModal = (record) => {
            editFormData.id = record.id;
            editFormData.name = record.name;
            editFormData.permission = record.permission;
            editCheckedKeys.value = JSON.parse(record.permission).map(item => item.key);
            editModalVisible.value = true;
        };

        const updateRole = async () => {
            editFormData.permission = JSON.stringify(getSelectedPermissions(editCheckedKeys.value));
            await http.post('/test/v1/users/update_role', editFormData);
            editModalVisible.value = false;
            fetchRoleList();
        };

        const deleteRole = async (id) => {
            await http.post('/test/v1/users/delete_role', { id });
            fetchRoleList();
        };

        const handleCancel = () => {
            createModalVisible.value = false;
            editModalVisible.value = false;
        };

        const onCreateCheck = (checkedKeys) => {
            createCheckedKeys.value = checkedKeys;
        };

        const onEditCheck = (checkedKeys) => {
            editCheckedKeys.value = checkedKeys;
        };

        const getSelectedPermissions = (checkedKeys) => {
            const map = {};
            const result = [];
            const initializeMap = (permissions) => {
                permissions.forEach(item => {
                    map[item.key] = { ...item, children: [] };
                    if (item.children && item.children.length > 0) {
                        initializeMap(item.children);
                    }
                });
            };

            initializeMap(menuPermissions);
            menuPermissions.forEach(item => {
                map[item.key] = { ...item, children: [] };
            });

            checkedKeys.forEach(key => {
                if (map[key]) {
                    result.push(map[key]);
                } else {
                    const parentKey = key.substring(0, key.lastIndexOf('/'));
                    map[parentKey].children.push(map[key] || { key });
                }
            });

            return result;
        };

        return {
            searchText,
            roleList,
            createModalVisible,
            editModalVisible,
            createFormData,
            editFormData,
            createCheckedKeys,
            editCheckedKeys,
            columns,
            paginationConfig,
            fetchRoleList,
            showCreateModal,
            createRole,
            showEditModal,
            updateRole,
            deleteRole,
            handleCancel,
            menuPermissions,
            onCreateCheck,
            onEditCheck,
            expandedKeys,
        };
    },
};
</script>

<style scoped></style>