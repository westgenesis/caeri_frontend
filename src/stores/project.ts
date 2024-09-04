// stores/project.ts
import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state: () => ({
    projectDetail: {} as Record<string, any>, // 初始化项目详情对象
  }),
  actions: {
    // 设置项目详情
    setProjectDetail(detail: Record<string, any>) {
      this.projectDetail = detail;
    },
    // 获取项目详情
    getProjectDetail(): Record<string, any> {
      return this.projectDetail;
    },
  },
});