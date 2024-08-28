<template>
    <div style="margin: 20px;">
        <a-page-header title="标签管理" />
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <div style="width: 15rem;">
                <!-- 标签组管理 -->
                <div>标签分组</div>
                <a-menu mode="inline" v-model:selectedKeys="selectedLabelGroup">
                    <a-menu-item v-for="group in labelGroupList" :key="group.label_group_id">
                        <div class="flex" style="justify-content: space-between;">
                            <span class="label-group-name">{{ group.label_group_name }}</span>
                            <div>
                                <a-button type="link" @click.stop="showEditLabelGroupModal(group)" class="ml-[16px]">
                                    <EditOutlined />
                                </a-button>
                                <a-button type="link" @click.stop="deleteLabelGroup(group.label_group_id)">
                                    <DeleteOutlined />
                                </a-button>
                            </div>
                        </div>

                        <!-- 替换文字按钮为图标按钮 -->

                    </a-menu-item>
                </a-menu>
                <a-button type="dashed" @click="showCreateLabelGroupModal" style="width: 100%; margin-top: 10px;"> 新增分组
                </a-button>
            </div>
            <div style="flex-grow: 1; padding-left: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <a-input-search v-model:value="searchText" placeholder="输入关键词" style="width: 200px"
                        @search="fetchLabelList" />
                    <a-button type="primary" @click="showCreateModal"> 添加标签 </a-button>
                </div>

                <a-table :columns="columns" :dataSource="pagedLabelList" :rowKey="record => record.label_id"
                    :pagination="paginationConfig" style="margin-top: 20px;">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'label_name'">
                            {{ record.label_name }}
                        </template>
                        <template v-if="column.key === 'label_group_name'">
                            {{ record.label_group_name }}
                        </template>
                        <template v-if="column.key === 'range'">
                            {{ record.range === 'all' ? '全部可见' : '仅自己' }}
                        </template>
                        <template v-if="column.key === 'creator'">
                            <div style="width: 100px;">
                                {{ record.creator }}
                            </div>

                        </template>
                        <template v-if="column.key === 'created_time'">
                            {{ record.created_time }}
                        </template>
                        <template v-if="column.key === 'action'">
                            <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                            <a-button type="link" size="small" @click="deleteLabel(record.label_id)">删除</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
        </div>

        <!-- 新增标签 Modal -->
        <a-modal title="新增标签" v-model:visible="createModalVisible" @ok="createLabel" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="createForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left">
                <a-form-item label="标签名称" name="label_name">
                    <a-input v-model:value="createFormData.label_name" />
                </a-form-item>
                <a-form-item label="标签组" name="label_group_id">
                    <a-select v-model:value="createFormData.label_group_id" allow-clear>
                        <a-select-option v-for="group in labelGroupList" :key="group.label_group_id"
                            :value="group.label_group_id">
                            {{ group.label_group_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="颜色" name="color">
                    <a-radio-group v-model:value="createFormData.color">
                        <a-radio :value="'#f5222d'">
                            <div style="background-color: #f5222d; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fa8c16'">
                            <div style="background-color: #fa8c16; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fadb14'">
                            <div style="background-color: #fadb14; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#1890ff'">
                            <div style="background-color: #1890ff; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#ffffff'">
                            <div
                                style="background-color: #ffffff; width: 30px; height: 24px;  border: 1px solid #d9d9d9;">
                            </div>
                        </a-radio>
                        <a-radio :value="'#52c41a'">
                            <div style="background-color: #52c41a; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#13c2c2'">
                            <div style="background-color: #13c2c2; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fa541c'">
                            <div style="background-color: #fa541c; width: 30px; height: 24px; "></div>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="可见范围" name="range">
                    <a-select v-model:value="createFormData.range" allow-clear>
                        <a-select-option value="self">仅自己</a-select-option>
                        <a-select-option value="all">全部可见</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 编辑标签 Modal -->
        <a-modal title="编辑标签" v-model:visible="editModalVisible" @ok="updateLabel" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form :form="editForm">
                <a-form-item label="标签名称" name="label_name">
                    <a-input v-model:value="editFormData.label_name" />
                </a-form-item>
                <a-form-item label="标签组" name="label_group_id">
                    <a-select v-model:value="editFormData.label_group_id" allow-clear>
                        <a-select-option v-for="group in labelGroupList" :key="group.label_group_id"
                            :value="group.label_group_id">
                            {{ group.label_group_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="颜色" name="color">
                    <a-radio-group v-model:value="editFormData.color">
                        <a-radio :value="'#f5222d'">
                            <div style="background-color: #f5222d; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fa8c16'">
                            <div style="background-color: #fa8c16; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fadb14'">
                            <div style="background-color: #fadb14; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#1890ff'">
                            <div style="background-color: #1890ff; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#ffffff'">
                            <div
                                style="background-color: #ffffff; width: 30px; height: 24px;  border: 1px solid #d9d9d9;">
                            </div>
                        </a-radio>
                        <a-radio :value="'#52c41a'">
                            <div style="background-color: #52c41a; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#13c2c2'">
                            <div style="background-color: #13c2c2; width: 30px; height: 24px; "></div>
                        </a-radio>
                        <a-radio :value="'#fa541c'">
                            <div style="background-color: #fa541c; width: 30px; height: 24px; "></div>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="可见范围" name="range">
                    <a-select v-model:value="editFormData.range" allow-clear>
                        <a-select-option value="self">仅自己</a-select-option>
                        <a-select-option value="all">全部可见</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 新增标签组 Modal -->
        <a-modal title="新增标签组" v-model:visible="createLabelGroupModalVisible" @ok="createLabelGroup"
            @cancel="handleCancel" okText="确定" cancelText="取消">
            <a-form :form="createLabelGroupForm">
                <a-form-item label="标签组名称" name="label_group_name">
                    <a-input v-model:value="createLabelGroupFormData.label_group_name" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 编辑标签组 Modal -->
        <a-modal title="编辑标签组" v-model:visible="editLabelGroupModalVisible" @ok="updateLabelGroup"
            @cancel="handleCancel" okText="确定" cancelText="取消">
            <a-form :form="editLabelGroupForm">
                <a-form-item label="标签组名称" name="label_group_name">
                    <a-input v-model:value="editLabelGroupFormData.label_group_name" />
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { http } from '../../http';
import { ElMessage, ElMessageBox } from 'element-plus';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const searchText = ref('');
const labelList = ref([]);
const labelGroupList = ref([]);
const selectedLabelGroup = ref([]);

watch(selectedLabelGroup, (newVal) => {
    fetchLabelList();
});
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createLabelGroupModalVisible = ref(false);
const editLabelGroupModalVisible = ref(false);
const createFormData = reactive({ label_name: '', label_group_id: null, color: '#f5222d', range: 'self' });
const editFormData = reactive({ label_id: '', label_name: '', label_group_id: null, color: '#f5222d', range: 'self' });
const createLabelGroupFormData = reactive({ label_group_name: '' });
const editLabelGroupFormData = reactive({ label_group_name: '', label_group_id: '' });

const columns = [
    { title: '标签名称', dataIndex: 'label_name', key: 'label_name' },
    { title: '标签分组', dataIndex: 'label_group_name', key: 'label_group_name' },
    { title: '可见范围', dataIndex: 'range', key: 'range' },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: '90'},
    { title: '创建时间', dataIndex: 'created_time', key: 'created_time' },
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

const fetchLabelList = async () => {
    const labelGroupId = selectedLabelGroup.value.length ? selectedLabelGroup.value[0] : null;
    const { data } = await http.post('/test/v1/labels/get_label_list', { label_group_id: labelGroupId, label_name: searchText.value || undefined });
    labelList.value = data;
    paginationConfig.total = data.length;
};

const fetchLabelGroupList = async () => {
    const { data } = await http.post('/test/v1/labels/get_label_group_list', {});
    labelGroupList.value = data;
};

const createLabel = async () => {
    if (!createFormData.label_name) {
        ElMessage.error('请填写标签名称');
        return;
    }
    if (!createFormData.label_group_id) {
        ElMessage.error('请选择标签组');
        return;
    }
    await http.post('/test/v1/labels/create_label', createFormData);
    createModalVisible.value = false;
    fetchLabelList();
};

const showCreateModal = () => {
    createModalVisible.value = true;
    Object.assign(createFormData, { name: '', label_group_id: null, color: '#f5222d', range: 'self' });
};

const showEditModal = (record) => {
    editFormData.label_id = record.label_id;
    editFormData.label_name = record.label_name;
    editFormData.label_group_id = record.label_group_id;
    editFormData.color = record.color;
    editFormData.range = record.range;
    editModalVisible.value = true;
};

const updateLabel = async () => {
    if (!editFormData.label_name) {
        ElMessage.error('请填写标签名称');
        return;
    }
    if (!editFormData.label_group_id) {
        ElMessage.error('请选择标签组');
        return;
    }
    await http.post('/test/v1/labels/update_label', editFormData);
    editModalVisible.value = false;
    fetchLabelList();
};

const deleteLabel = async (label_id) => {
    ElMessageBox.confirm('确定要删除该标签吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await http.post('/test/v1/labels/delete_label', { label_id });
        fetchLabelList();
    }).catch(() => {
        // 用户取消删除
    });
};

const createLabelGroup = async () => {
    if (!createLabelGroupFormData.label_group_name) {
        ElMessage.error('请填写标签组名称');
        return;
    }
    await http.post('/test/v1/labels/create_label_group', { label_group_name: createLabelGroupFormData.label_group_name });
    createLabelGroupModalVisible.value = false;
    fetchLabelGroupList();
};

const showCreateLabelGroupModal = () => {
    createLabelGroupModalVisible.value = true;
    Object.assign(createLabelGroupFormData, { label_group_name: '' });
};

const showEditLabelGroupModal = (group) => {
    editLabelGroupFormData.label_group_id = group.label_group_id;
    editLabelGroupFormData.label_group_name = group.label_group_name;
    editLabelGroupModalVisible.value = true;
};

const updateLabelGroup = async () => {
    if (!editLabelGroupFormData.label_group_name) {
        ElMessage.error('请填写标签组名称');
        return;
    }
    await http.post('/test/v1/labels/update_label_group', { label_group_id: editLabelGroupFormData.label_group_id, label_group_name: editLabelGroupFormData.label_group_name });
    editLabelGroupModalVisible.value = false;
    fetchLabelGroupList();
};

const deleteLabelGroup = async (label_group_id) => {
    ElMessageBox.confirm('确定要删除该标签组吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        await http.post('/test/v1/labels/delete_label_group', { label_group_id });
        fetchLabelGroupList();
    }).catch(() => {
        // 用户取消删除
    });
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
    createLabelGroupModalVisible.value = false;
    editLabelGroupModalVisible.value = false;
};

const pagedLabelList = computed(() => {
    const start = (paginationConfig.current - 1) * paginationConfig.pageSize;
    const end = start + paginationConfig.pageSize;
    return labelList.value.slice(start, end);
});

onMounted(() => {
    fetchLabelGroupList();
});
</script>

<style scoped>
.label-group-name {
    display: inline-block;
    max-width: calc(100% - 7rem);
    /* 根据需要调整宽度 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
</style>