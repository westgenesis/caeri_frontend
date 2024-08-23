
// 希望查询项目时的树长这样
const schema = {
  "total": 1,
  "page": 1,
  "data": [
    {
      "_id": {
        "$oid": "6698e105caf25f96613c46ec"
      },
      "name": "2",
      "notes": "",
      "kind": "VT",
      "storage_path": "",
      "download_path": "",
      "period_start": "2024-07-02",
      "period_end": "2024-08-14",
      // 知识库对应文件
      "file_list": [],
      "owner": {
        "$ref": "owner",
        "$id": "f1c2e70c24b84371a387c0e5ec28adf2"
      },
      "time_created": {
        "$date": "2024-07-18T09:31:49.131Z"
      },
      "last_modified": {
        "$date": "2024-07-18T09:31:49.131Z"
      },
      "display_id": 1,
      "status": {
        "test_requirements": 0,
        "test_cases": 0,
        "test_scripts": 0
      },
      "project_status": "0",
      "requirement_files": [
        {
          "name": "6698e105caf25f96613c46ec/DFM_V_VIU_Specification03_ATWS_V2.2.docx",
          "creator": "1353564917@qq.com",
          "status": "parsed",

          "req_id": "46ec01",
          "version": "1.0",
          //大需求文档的小版本号没有用 只用1也可以
          "created_time": "2024-07-18 17:31",
          // 需求块级别
          "split_require": [
            {
              "chunk_index": 0,
              "object_name": "6698e105caf25f96613c46ec/0_\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx", // 文件存储的地址
              "file_name": "\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx",
              "version": "1.1", // 初始化的时候版本号与需求文档版本号一致
              "description": "", // 默认为空

              // 最近发现这里可能大于100个 所以得是三位数 为F+req_id加上三位编号组成
              "split_req_id": "F46ec01001", // 生成的规则前面加上f
              "split_case": [{
                "testcase_id": "Pr46ec01001001",
                "testcase_name": "打开wifi",
                "last_modified": "2024-07-18 17:31",
                "pre_condition": "BCM处于诊断扩展会话模式",
                "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
                "result": "车身防盗功能激活，反馈信号=1",
                "version": "1.0.1", // 初始化的时候版本号是子需求版本号+.0 组成
                //修改后 把之前的cases存到old_versions中即可
                "old_versions": [{
                  "testcase_id": "Pr46ec01001001",
                  "testcase_name": "打开wifi",
                  "last_modified": "2024-07-18 17:31",
                  "pre_condition": "BCM处于诊断扩展会话模式",
                  "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
                  "result": "车身防盗功能激活，反馈信号=1",
                  "version": "1.0.0",
                  "description": "" // 默认为空
                }]
              }],

              // 每次客户保存split_requires 需要把旧的split_require的字段保存到old_versions中 并把版本号增加1
              "old_versions": [{
                "chunk_index": 0,
                "object_name": "6698e105caf25f96613c46ec/0_\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx", // 文件存储的地址
                "file_name": "\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx",
                "status_case": 2,
                "version": "1.0",
                "description": "", // 默认为空
                // 最近发现这里可能大于100个 所以得是三位数 为req_id加上三位编号组成
                "split_req_id": "46ec01001",
              }]
            }
          ],
          "old_versions": [{
            //... 用户更新文档之后把之前的版本数据放到这里 并把新版本的版本号+1
            "name": "6698e105caf25f96613c46ec/DFM_V_VIU_Specification03_ATWS_V2.2.docx",
            "creator": "1353564917@qq.com",
            "status": "parsed",
            //...
          }]
        }
      ]
    }
  ]
}



// 添加功能模块 /dev-api/add_split_require
// 【入参】
const addSplitRequireParams = {
  "description": "", // 默认为空
  "object_name": "6698e105caf25f96613c46ec/0_防盗报警功能激活与关闭.docx", // 文件存储的地址 前端先调用upload_project_file上传得到
  "file_name": "0_防盗报警功能激活与关闭.docx", // 文件名
  "req_id": "46ec01",
  "version": "1.0",
  "name": "" // ...
}

// 插入后需要生成的对应split_require
const addSplitRequireResult = {
  "chunk_index": 0,
  "object_name": "6698e105caf25f96613c46ec/0_防盗报警功能激活与关闭.docx", // 文件存储的地址
  "file_name": "0_防盗报警功能激活与关闭.docx",
  "version": "1.0", // 初始化的时候版本号与需求文档版本号一致
  "description": "", // 默认为空
  "split_req_id": "Fe46ec01001", // 用户创建的规则前面加上Fe
  "chunk_index": 1 // index是对应排序的index
}

// 修改功能模块 /dev-api/upload_project_file 新增一个case 也可考虑新增接口 不过原来的系统是直接调的这里
const modifySplitRequireParams = {
  // info和user_file的用法参考upload_project_file
  info: {
    db_id: "6698e105caf25f96613c46ec",
    category: 'update_split_require',
    req_id: '46ec01',
    splitReq: {
      'chunk_index': 0,
      'object_name': '6698e105caf25f96613c46ec/0_防盗报警功能激活与关闭.docx',
      'file_name': '防盗报警功能激活与关闭.docx',
      "split_req_id": "F46ec01001",
      "version": "1.0"
    },
    newFileName: '防盗报警功能激活与关闭2.docx',
    description: "aaa"
  },
  "user_file": "二进制文件 参考upload_project_file"
}

// 修改后的对应split_require
const modifySplitRequireResult = {
  "chunk_index": 0,
  "object_name": "6698e105caf25f96613c46ec/防盗报警功能激活与关闭2.docx", // 文件存储的地址
  "file_name": "防盗报警功能激活与关闭2.docx",
  "version": "1.1", // 初始化的时候版本号与需求文档版本号一致
  "description": "aaa", // 默认为空
  "split_req_id": "F46ec01001",
  "old_versions": [{
    "chunk_index": 0,
    "object_name": "6698e105caf25f96613c46ec/0_防盗报警功能激活与关闭.docx", // 文件存储的地址
    "file_name": "0_防盗报警功能激活与关闭.docx",
    "version": "1.0", // 初始化的时候版本号与需求文档版本号一致
    "description": "", // 默认为空
    "split_req_id": "F46ec01001",
  }]
}

// 拆分功能点 /dev-api/generate_split_case
// [入参]
const generateTestCaseParams = {
  "req_id": "46ec01",
  "split_req_id": "F46ec01001",
  "project_id": "6698e105caf25f96613c46ec",
  "object_name": "6698e105caf25f96613c46ec/0_防爆报警功能激活与关闭.docx",
  "file_name": "0_防爆报警功能激活与关闭.docx",
  "chunk_index": 0,
  "version": "1.1"
}

// 拆分后得到的对应split_require
const generateTestCaseResult = {
  "chunk_index": 0,
  "object_name": "6698e105caf25f96613c46ec/0_\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx", // 文件存储的地址
  "file_name": "\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx",
  "version": "1.1", // 初始化功能点的时候版本号与split_require版本号一致
  "description": "aaa", // 默认为空
  "split_req_id": "F46ec01001",
  "split_case": [{
    "testcase_id": "Pr46ec01001001",  // 功能点点编号是Pr+ split_req_id + 001
    "testcase_name": "打开wifi",
    "last_modified": "2024-07-18 17:31",
    "pre_condition": "BCM处于诊断扩展会话模式",
    "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
    "result": "车身防盗功能激活，反馈信号=1",
    "version": "1.1.0", // 初始化的时候版本号是子需求版本号+.0 组成
  }
    //...
  ],
}

// 修改功能点 /dev-api/modify_split_case
const modifySplitCaseParams = {
    "project_id": "6698e105caf25f96613c46ec",
    "req_id": "46ec01",
    "split_req_id": "F46ec01001",
    "testcase_id": "Pr46ec01001001",
    "testcase_name": "打开wifi2",
    "last_modified": "2024-07-18 17:31",
    "pre_condition": "BCM处于诊断扩展会话模式",
    "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
    "result": "车身防盗功能激活，反馈信号=1",
    "version": "1.0.0",
  }

  // 修改功能点后的对应result
const modifySplitCaseResult = {
  "split_case": [{
                "testcase_id": "Pr46ec01001001",
                "testcase_name": "打开wifi2",
                "last_modified": "2024-07-18 17:31",
                "pre_condition": "BCM处于诊断扩展会话模式",
                "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
                "result": "车身防盗功能激活，反馈信号=1",
                "version": "1.0.1", // 初始化的时候版本号是子需求版本号+.0 组成
                //修改后 把之前的cases存到old_versions中即可
                "old_versions": [{
                  "testcase_id": "Pr46ec01001001",
                  "testcase_name": "打开wifi",
                  "last_modified": "2024-07-18 17:31",
                  "pre_condition": "BCM处于诊断扩展会话模式",
                  "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
                  "result": "车身防盗功能激活，反馈信号=1",
                  "version": "1.0.0",
                  "description": "" // 默认为空
                }]
              }]
}

// 更新需求文档 调用upload_project_file接口
const updateReqDocParams = {
    // info和user_file的用法参考upload_project_file
  info: {
      db_id: "6698e105caf25f96613c46ec", // 在upload_project_file里叫db_id
      category: 'update_split_require',
      req_id: '46ec01',
      newFileName: 'DFM_ZV_V1.9.2.docx',
      "version": "1.0",
  },
  "user_file": "二进制文件 参考upload_project_file"
}

// 更新需求文档后的对应project
const updateReqResult = {
"requirement_files": [
  {
    "name": "6698e105caf25f96613c46ec/DFM_V_VIU_Specification03_ATWS_V2.2.docx",
    "creator": "1353564917@qq.com",
    "status": "uploaded",
    "req_id": "46ec01",
    "version": "1.1",
    //大需求文档的小版本号没有用 只用1也可以
    "created_time": "2024-07-18 17:31",
    "oldversion": [{
      "name": "6698e105caf25f96613c46ec/DFM_V_VIU_Specification03_ATWS_V2.1.docx",
      "creator": "1353564917@qq.com",
      "status": "parsed",
      "req_id": "46ec01",
      "version": "1.0",
      //大需求文档的小版本号没有用 只用1也可以
      "created_time": "2024-07-18 17:31",
    }],
    "split_require": [
      {
        "chunk_index": 0,
        "object_name": "6698e105caf25f96613c46ec/0_\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx", // 文件存储的地址
        "file_name": "\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx",
        "version": "1.1", // 初始化的时候版本号与需求文档版本号一致
        "description": "", // 默认为空

        // 最近发现这里可能大于100个 所以得是三位数 为F+req_id加上三位编号组成
        "split_req_id": "F46ec01001", // 生成的规则前面加上f
        "split_case": [{
          "testcase_id": "Pr46ec01001001",
          "testcase_name": "打开wifi",
          "last_modified": "2024-07-18 17:31",
          "pre_condition": "BCM处于诊断扩展会话模式",
          "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
          "result": "车身防盗功能激活，反馈信号=1",
          "version": "1.0.1", // 初始化的时候版本号是子需求版本号+.0 组成
          //修改后 把之前的cases存到old_versions中即可
          "old_versions": [{
            "testcase_id": "Pr46ec01001001",
            "testcase_name": "打开wifi",
            "last_modified": "2024-07-18 17:31",
            "pre_condition": "BCM处于诊断扩展会话模式",
            "action": "接收到诊断DID-0x0223中AtwsFunctionEnable-1",
            "result": "车身防盗功能激活，反馈信号=1",
            "version": "1.0.0",
            "description": "" // 默认为空
          }]
        }],

        // 每次客户保存split_requires 需要把旧的split_require的字段保存到old_versions中 并把版本号增加1
        "old_versions": [{
          "chunk_index": 0,
          "object_name": "6698e105caf25f96613c46ec/0_\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx", // 文件存储的地址
          "file_name": "\u9632\u76d7\u62a5\u8b66\u529f\u80fd\u6fc0\u6d3b\u4e0e\u5173\u95ed.docx",
          "status_case": 2,
          "version": "1.0",
          "description": "", // 默认为空
          // 最近发现这里可能大于100个 所以得是三位数 为req_id加上三位编号组成
          "split_req_id": "46ec01001",
        }]
      }
    ],
  }]
}

// 删除功能点 (可以先不做)
const deleteSplitCaseParams = {
  "project_id": "6698e105caf25f96613c46ec",
  "req_id": "46ec01",
  "split_req_id": "F46ec01001",
  "testcase_ids": ["Pr46ec01001001", "Pr46ec01001002"]
}

// 删除功能模块(可以先不做)
const deleteSplitRequireParams = {
  "project_id": "6698e105caf25f96613c46ec",
  "req_id": "46ec01",
  "split_req_ids": ["F46ec01001", "F46ec01002"]
}