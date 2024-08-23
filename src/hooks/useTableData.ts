import { provide, reactive, Ref, ref } from 'vue'

export type IUseTable<T extends Array<any> = []> = () => {
  tableData: Ref<T>
  loading: boolean
  pagination: Record<'size' | 'current' | 'total', number>
}
export const useTable = <T extends Record<string, any> = any>() => {
  const tableData = ref<T[]>([] as unknown as T[])
  const pagination = reactive({
    size: 10,
    current: 1,
    total: 0
  })
  const loading = ref(false)

  const setPagination = (data: typeof pagination) => {
    Object.assign(pagination, data)
  }

  // 处理表格数据
  const handlerTableData = (data: any[]) => {
    return data.map((it: any, idx: number) => {
      return {
        ...it,
        // 序号
        $index:
          pagination.current === 1 ? idx + 1 : (pagination.current - 1) * pagination.size + idx + 1
      }
    })
  }

  const obs = {
    loading,
    tableData,
    pagination,
    setPagination,
    handlerTableData
  }

  provide('tableHook', obs)

  return obs
}
