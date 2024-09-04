<template>
    <div style="margin: 20px;">
        <a-page-header title="客户管理" />
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <a-input-search v-model:value="searchText" placeholder="输入客户名称" style="width: 200px"
                @search="fetchCustomerList" />
            <a-button type="primary" @click="showCreateModal">新增客户</a-button>
        </div>

        <a-table :columns="columns" :dataSource="pagedCustomerList" :rowKey="record => record.customer_id"
            :pagination="paginationConfig" :scroll="{ y: table_height }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'customer_id'">
                    {{ record.customer_id }}
                </template>
                <template v-if="column.key === 'name'">
                    {{ record.name }}
                </template>
                <template v-if="column.key === 'phone'">
                    {{ record.phone }}
                </template>
                <template v-if="column.key === 'address'">
                    {{ record.address }}
                </template>
                <template v-if="column.key === 'labels'">
                    <span v-for="label in record.labels" :key="label.label_id">
                        <a-tag :color="label.color">
                            {{ label.label_name }}
                        </a-tag>
                    </span>
                </template>
                <template v-if="column.key === 'comment'">
                    {{ record.comment }}
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
                    <a-button type="link" size="small" @click="deleteCustomer(record.customer_id)">删除</a-button>
                </template>
            </template>
        </a-table>

        <a-modal title="新增客户" v-model:visible="createModalVisible" @ok="createCustomer" @cancel="handleCancel"
            okText="确定" cancelText="取消">
            <a-form ref="createForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left"
                :model="createFormData" :rules="rules">
                <a-form-item label="客户名称" name="name">
                    <a-input v-model:value="createFormData.name" />
                </a-form-item>
                <a-form-item label="地址" name="address">
                    <a-input v-model:value="createFormData.address" />
                </a-form-item>
                <a-form-item label="联系电话" name="phone">
                    <a-input v-model:value="createFormData.phone" />
                </a-form-item>
                <LabelSelector ref="labelSelectorRef" v-model="selectedLabels" label-group-type="client" />
                <a-form-item label="备注" name="comment">
                    <a-input v-model:value="createFormData.comment" maxlength="128" />
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal title="编辑客户" v-model:visible="editModalVisible" @ok="updateCustomer" @cancel="handleCancel" okText="确定"
            cancelText="取消">
            <a-form ref="editForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" labelAlign="left"
                :model="editFormData" :rules="rules">
                <a-form-item label="客户名称" name="name">
                    <a-input v-model:value="editFormData.name" />
                </a-form-item>
                <a-form-item label="地址" name="address">
                    <a-input v-model:value="editFormData.address" />
                </a-form-item>
                <a-form-item label="联系电话" name="phone">
                    <a-input v-model:value="editFormData.phone" />
                </a-form-item>
                <LabelSelector ref="labelSelectorRef" v-model="selectedLabels" label-group-type="client" />
                <a-form-item label="备注" name="comment">
                    <a-input v-model:value="editFormData.comment" maxlength="128" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { http } from '../../http';
import LabelSelector from '../LabelManage/LabelSelector.vue';

const selectedLabels = ref([]);

const searchText = ref('');
const customerList = ref([]);
const createModalVisible = ref(false);
const editModalVisible = ref(false);
const createFormData = reactive({ name: '', address: '', phone: '', label_ids: [], comment: '' });
const editFormData = reactive({ customer_id: '', name: '', address: '', phone: '', label_ids: [], comment: '' });
const labelOptions = ref([]);
const customerListFiltered = ref([]);
const table_height = window.innerHeight * 0.55;

const createForm = ref(null);
const editForm = ref(null);
const labelSelectorRef = ref(null);

const columns = [
    { title: '客户编号', dataIndex: 'customer_id', key: 'customer_id' },
    { title: '客户名称', dataIndex: 'name', key: 'name' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '地址', dataIndex: 'address', key: 'address' },
    { title: '客户标签', dataIndex: 'labels', key: 'labels' },
    { title: '备注', dataIndex: 'comment', key: 'comment' },
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

const fetchCustomerList = async () => {
    const { data } = await http.post('/test/v1/customers/get_customer_list', { name: searchText.value || undefined });
    customerList.value = data;
    paginationConfig.total = data.length;
};

const pagedCustomerList = computed(() => {
    const start = (paginationConfig.current - 1) * paginationConfig.pageSize;
    const end = start + paginationConfig.pageSize;
    return customerList.value.slice(start, end);
});

const fetchLabelOptions = async () => {
    const { data } = await http.post('/test/v1/labels/get_label_list', {});
    labelOptions.value = data;
};

const showCreateModal = () => {
    createModalVisible.value = true;
    selectedLabels.value = [];
    Object.assign(createFormData, { name: '', address: '', phone: '', label_ids: [], comment: '' });
};

const createCustomer = () => {
    createForm.value.validate().then(async () => {
        createFormData.label_ids = selectedLabels.value.map(label => label.label_id);
        await http.post('/test/v1/customers/create_customer', createFormData);
        createModalVisible.value = false;
        fetchCustomerList();
    }).catch(() => {
        console.log('Validation failed');
    });
};

const showEditModal = (record) => {
    editFormData.customer_id = record.customer_id;
    editFormData.name = record.name;
    editFormData.address = record.address;
    editFormData.phone = record.phone;
    editFormData.comment = record.comment;
    // 设置 selectedLabels 为当前行的标签值
    selectedLabels.value = [...record.labels]
    editModalVisible.value = true;
};

const updateCustomer = () => {
    editForm.value.validate().then(async () => {
        editFormData.label_ids = selectedLabels.value.map(label => label.label_id);
        await http.post('/test/v1/customers/update_customer', editFormData);
        editModalVisible.value = false;
        fetchCustomerList();
    }).catch(() => {
        console.log('Validation failed');
    });
};

const deleteCustomer = async (customer_id) => {
    await http.post('/test/v1/customers/delete_customer', { customer_id });
    fetchCustomerList();
};

const handleCancel = () => {
    createModalVisible.value = false;
    editModalVisible.value = false;
};

onMounted(() => {
    fetchCustomerList();
    fetchLabelOptions();
});

const rules = {
    phone: [{
        validator: (_, value) => {
            const phoneRegex = /^\d{1,20}$/;
            if (!value || phoneRegex.test(value)) {
                return Promise.resolve();
            } else {
                return Promise.reject('联系电话只能包含最多20位数字');
            }
        }, trigger: 'change'
    }],
    name: [{
        validator: (_, value) => {
            if (!value || value.length <= 25) {
                return Promise.resolve();
            } else {
                return Promise.reject('客户名称最多只能包含25个字符');
            }
        }, trigger: 'change'
    }],
};
</script>

<style scoped></style>