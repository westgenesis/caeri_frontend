<template>
    <div style="margin: 20px;">
        <a-page-header title="角色管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="请输入角色名" style="width: 200px"
                @search="fetchRoleList" />
            <a-button type="primary" @click="showCreateModal"> 新增角色 </a-button>
        </div>

        <a-table :columns="columns" :dataSource="roleList" :rowKey="record => record.role_id"
            pagination="paginationConfig" :scroll="{ y: table_height}">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'role_status'">
                    <a-tag>{{ record.role_status ? '启用' : '禁用' }}</a-tag>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="deleteRole(record)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增角色" v-model:visible="createModalVisible" @ok="createRole" @cancel="handleCancel" okText="确定"
            cancelText="取消">
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

        <a-modal title="编辑角色" v-model:visible="editModalVisible" @ok="updateRole" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="editForm">
                <a-form-item label="角色名" name="name">
                    <a-input v-model:value="editFormData.name" />
                </a-form-item>
                <a-form-item label="权限" name="permission">
                    <a-tree checkable :treeData="menuPermissions" :defaultExpandedKeys="expandedKeys"
                        :checkedKeys="editCheckedKeys" @check="onEditCheck"/>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox } from 'element-plus';

export const menuPermissions = [
    {
        title: '工作台',
        key: '/home',
        children: [],
        disableCheckbox: true // 禁用“工作台”节点的选择状态
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
                key: '/groupManage',
                children: [],
            },
            {
                title: '客户信息管理',
                key: '/customerManage',
                children: [],
            },
        ],
    },
    {
        title: '标签管理',
        key: '/labelManage',
        children: [],
    },
    {
        title: '项目管理',
        key: '/projectManage',
        children: [],
    },
    {
        title: '样品管理',
        key: '/sampleManage',
        children: [],
    },
    {
        title: '工具管理',
        key: '/toolManage',
        children: []
    }
];

export default {
    setup() {
        const table_height = window.innerHeight * 0.55;
        const searchText = ref('');
        const roleList = ref([]);
        const createModalVisible = ref(false);
        const editModalVisible = ref(false);
        const createFormData = reactive({ name: '', permission: '' });
        const editFormData = reactive({ role_id: '', name: '', permission: '' });
        const createCheckedKeys = ref(['/home']); // 默认选中“工作台”节点
        const editCheckedKeys = ref(['/home']); // 默认选中“工作台”节点
        const expandedKeys = ref(menuPermissions.map(item => item.key));
        const isDisabled = ref({ '/home': true }); // 禁用“工作台”节点的选择状态

        const columns = [
            { title: '角色ID', dataIndex: 'role_id' },
            { title: '角色名称', dataIndex: 'role_name' },
            { title: '角色状态', dataIndex: 'role_status', key: 'role_status' },
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
                fetchRoleList();
            },
        });

        onMounted(() => {
            fetchRoleList();
        });

        const fetchRoleList = async () => {
            const { data } = await http.post('/test/v1/users/get_role_list', { name: searchText.value || undefined });
            console.log(data)
            data.map(x => x.permission = x.role_limit)
            data.map(x => x.name = x.role_name)
            roleList.value = data;
        };

        const showCreateModal = () => {
            createModalVisible.value = true;
            createFormData.name = '';
            createCheckedKeys.value = ['/home']; // 默认选中“工作台”节点
        };

        const createRole = async () => {
            if (!createFormData.name) {
                ElMessage.error('请输入角色名称');
                return;
            }
            createFormData.permission = JSON.stringify(getSelectedPermissions(createCheckedKeys.value));
            http.post('/test/v1/users/create_role', createFormData).then((response) => {
                console.log(response)
                if (response.status === 'ok') {
                    ElMessage.success('创建角色成功');
                } else {
                    ElMessage.error('创建角色失败');
                }
            }).catch(response => {
                ElMessage.error('创建角色失败');
            }).finally(() => {
                createModalVisible.value = false;
                fetchRoleList();
            })
        };

        const showEditModal = (record) => {
            editFormData.role_id = record.role_id;
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

        const deleteRole = async (role) => {
            const confirmResult = await ElMessageBox.confirm(
                '确定要删除该角色吗？',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            );

            if (confirmResult) {
                await http.post('/test/v1/users/delete_role', { role_id: role.role_id });
                fetchRoleList();
            }
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
            table_height,
            isDisabled
        };
    },
};
</script>

<style scoped></style>