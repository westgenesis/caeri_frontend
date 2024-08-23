

import { dayjs } from 'element-plus';
import { http } from '../http';
export function useProductFetch() {
  const handler = {
    Create: async (data: any) => {
      return await http.put(`/api/create_new_project`, data)
    },
    // 详情
    Detail: async (id: string | number) => {
      const response = <any>await http.get(`/api/project_info/${id}`)
      return handleTableData(response.project_data)
    },
    Delete: async (id: string | number) => {
      return await http.delete(`/api/delete_project/${id}`)
    },
    // 文件上传
    UploadFile: async (formData: any) => {
      const response = await http.post(`/api/upload_project_file`, formData)
      return response.status
    },
    ReplaceFile: async (formData: any) => {
      const response = await http.post(`/api/replace_document`, formData)
      return response.status
    },
    DownloadFile: async (id: string, name: string) => {
      const response = await http.post(
        `/api/get_document`,
        {
          project_id: id,
          object_name: name
        },
        {
          responseType: 'blob'
        }
      )
      return response
    },
    DownloadTemplate: async (savePath, filename = '映射表模版文件.xlsx') => {
      return http
        .get(`/api/download_template`, {
          responseType: 'blob'
        })
        .then((response) => {
          blobToBase64(response as any as Blob).then((base64String) => {
            window.electron.ipcRenderer.send('start-download', base64String, savePath, filename)
          })
        })
    },
    ParseDocument: async (id: string) => {
      return await http.post(`/api/do_split_workflow`, {
        project_id: id,
        company: 'dongfeng'
      })
    },
    GenerateTestcase: async (id: string, user_already_uploaded: number) => {
      const response = await http.post(`/api/generate_testcase`, {
        project_id: id,
        user_already_uploaded,
        company: 'dongfeng'
      })
      return response
    },
    GenerateTestcaseNew: async (id: string) => {
      const response = await http.post(`/api/generate_testcase_new`, {
        project_id: id
      })
      return response
    },
    GenerateScript: async (id: string) => {
      const response = await http.post(`/api/generate_scripts`, {
        project_id: id
      })
      return response
    },
    // 获取脚本生成的错误列表数据
    getGenerationErrors: async (id: string) => {
      const response = await http.post(`/api/script_generation_errors`, {
        project_id: id
      })
      return response
    },
    // 传参？
    updateGenerationErrors: async (id: string, formData: any) => {
      const response = await http.post(`/api/update_error_specifications`, {
        project_id: id,
        error_feedback: formData
      })
      return response
    },
    // 生成映射表
    generateMappings: async (id: string) => {
      const response = await http.post(`/api/create_mappings`, {
        project_id: id
      })
      return response
    },
    StopTask: async (id: string, jobId: string) =>
      http.delete(`/api/cancel_job`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          project_id: id,
          job_id: jobId,
          task_type: 'generate_testcase'
        }
      }),
    DeleteFile: async (project_id: string, object_type: string, chunk_index?: number) =>
      http.delete('/api/delete_project_file', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          project_id,
          object_type,
          chunk_index
        }
      })
  }

  return {
    handler
  }
}

// 将Blob对象转换为Base64字符串
function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function handleTableData(it) {
  const _requirementFileList = <any[]>[],
    _exampleFileList = <any[]>[],
    _scriptFileList = <any[]>[]
  Object.keys(it.files || {}).forEach((key) => {
    const item = it.files[key]
    if (key == 'main_docx') {
      _requirementFileList.push({
        name: item.file_name,
        url: item.object_name,
        ...item
      })
    }
  })
  if (it.files.dbc_data) _exampleFileList.push(it.files.dbc_data)
  if (it.files.testcase) _exampleFileList.push(it.files.testcase)
  if (it.files.mappings_1) _exampleFileList.push(it.files.mappings_1)
  if (it.files.mappings_1) _exampleFileList.push(it.files.mappings_2)
  if (it.files.mappings_1) _exampleFileList.push(it.files.mappings_3)

  if (it.files.vtt_script) _scriptFileList.push(it.files.vtt_script)

  const _allFile = [
    ...(it.files?.main_docx?.split_files || []),
    ..._exampleFileList,
    ..._scriptFileList
  ]

  const { test_requirements, test_cases, test_scripts } = it?.status || {}
  return {
    ...it,
    _active: test_scripts == 2 ? 3 : test_cases == 2 ? 2 : test_requirements == 2 ? 1 : 0,
    _savePath: it.storage_path,
    _downloadPath: it.download_path,
    _requirementFileList,
    _exampleFileList,
    _scriptFileList,
    _allFile,
    _create_at: dayjs(it.time_created?.$date).format('YYYY-MM-DD HH:mm:ss'),
    _update_at: dayjs(it.last_modified?.$date).format('YYYY-MM-DD HH:mm:ss')
  }
}
