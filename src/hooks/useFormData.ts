import { reactive, ref, Ref } from 'vue'
import { FormInstance, FormRules } from 'element-plus'

export interface IUseFormData<T extends object = {}> {
  formData: T
  formDataRef: Ref<FormInstance | undefined>
  formDataRules?: FormRules
  setDefaultFormData: (data: Record<string, any>) => void
}

export interface FormDataProps<T = any> {
  row?: T
  mode: 'edit' | 'add' | 'detail' | 'audit' | 'dict' | 'default'
}

export const useFormData = <T extends Record<any, any>>(
  data: T,
  rules: FormRules = {}
): IUseFormData<T> => {
  const formData = reactive<T>(data)
  const formDataRef = ref<FormInstance>()
  const formDataRules = reactive<FormRules>(rules)

  const setDefaultFormData = (data: Record<string, any>) => {
    Object.keys(formData).forEach((key) => {
      // @ts-ignore
      formData[key] = data[key]
    })
  }
  return {
    formData,
    formDataRef,
    formDataRules,
    setDefaultFormData
  }
}
