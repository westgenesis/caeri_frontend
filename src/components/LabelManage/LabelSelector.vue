<template>
  <a-form-item label="标签">
    <div @click="showModal">
      <a-tag v-for="label in selectedLabels" :key="label.label_id" closable @close="removeLabel(label)" :color="label.color">
        {{ label.label_name }}
      </a-tag>
      <a-button type="dashed" style="margin-left: 8px;">选择标签</a-button>
    </div>
  </a-form-item>

  <a-modal title="选择标签" v-model:visible="modalVisible" @ok="handleOk" @cancel="handleCancel" width="80%" okText="确定" cancelText="取消">
    <div style="display: flex; flex-direction: column; height: 60vh;">
      <!-- 分割线上方的当前选中的标签 -->
       
      <div style="margin-bottom: 1rem;">
        已选择的标签：
      </div>
      <div style="border-bottom: 1px solid #f0f0f0; padding-bottom: 16px;">
        <a-tag v-for="label in selectedLabels" :key="label.label_id" closable @close="removeLabel(label)">
          {{ label.label_name }}
        </a-tag>
      </div>
      <!-- 分割线下方的标签选择区域 -->
      <div style="display: flex; flex: 1; margin-top: 16px;">
        <div style="width: 20%; border-right: 1px solid #f0f0f0;">
          <a-menu mode="inline" v-model:selectedKeys="selectedLabelGroup">
            <a-menu-item v-for="group in labelGroupList" :key="group.label_group_id">
              {{ group.label_group_name }}
            </a-menu-item>
          </a-menu>
        </div>
        <div style="flex: 1; padding-left: 20px;">
          <a-table :columns="columns" :dataSource="filteredLabelList" :rowKey="record => record.label_id" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button type="link" size="small" @click="addLabel(record)">选择</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted} from 'vue';
import { http } from '../../http';

const props = defineProps({
  labelGroupType: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedLabels = ref([...props.modelValue]);
const modalVisible = ref(false);
const labelGroupList = ref([]);
const selectedLabelGroup = ref([]);
const labelList = ref([]);

onMounted(() => {
  console.log(props)
})

const columns = [
  { title: '标签名称', dataIndex: 'label_name', key: 'label_name' },
  { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }},
];

const filteredLabelList = computed(() => {
  const groupId = selectedLabelGroup.value.length ? selectedLabelGroup.value[0] : null;
  return labelList.value.filter(label => label.label_group_id === groupId);
});

const fetchLabelGroupList = async () => {
  const { data } = await http.post('/test/v1/labels/get_label_group_list', { label_group_type: props.labelGroupType });
  labelGroupList.value = data;
  if (labelGroupList.value.length > 0) {
    selectedLabelGroup.value = [labelGroupList.value[0].label_group_id];
  }
};

const fetchLabelList = async () => {
  const { data } = await http.post('/test/v1/labels/get_label_list', { label_group_type: props.labelGroupType });
  labelList.value = data;
};

const showModal = () => {
  modalVisible.value = true;
  fetchLabelGroupList();
  fetchLabelList();
};

const handleOk = () => {
  modalVisible.value = false;
  emit('update:modelValue', selectedLabels.value);
};

const handleCancel = () => {
  modalVisible.value = false;
};

const addLabel = (label) => {
  if (!selectedLabels.value.some(item => item.label_id === label.label_id)) {
    selectedLabels.value.push(label);
    emit('update:modelValue', selectedLabels.value);
  }
  console.log(props)
};

const removeLabel = (label) => {
  selectedLabels.value = selectedLabels.value.filter(item => item.label_id !== label.label_id);
  emit('update:modelValue', selectedLabels.value);
};

watch(props.modelValue, (newVal) => {
  console.log(newVal);
  selectedLabels.value = newVal
})

watch(selectedLabelGroup, () => {
  fetchLabelList();
});
</script>

<style scoped>
.ant-tag {
  margin-right: 8px;
}
</style>