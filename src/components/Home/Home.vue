<template>
    <div>
      <div>上午好，Admin!</div>
  
      <div class="flex h-[160px]">
        <a-card style="width: 70%">
          <strong>快捷操作</strong>
          <div class="quick-actions">
            <div class="action-item">
              <img :src="project" />
              <div>新建项目</div>
            </div>
            <div class="action-item">
              <img :src="usecase" />
              <div>新建用例</div>
            </div>
            <div class="action-item">
              <img :src="mission" />
              <div>新建任务</div>
            </div>
            <div class="action-item">
              <img :src="report" />
              <div>下载报告</div>
            </div>
          </div>
        </a-card>
  
        <div class="charts" style="padding: 1rem; border: 1px #eee solid">
          <div class="chart-container">
            <div class="chart-title">项目总数</div>
            <div id="projectChart" class="chart"></div>
          </div>
          <div class="chart-container">
            <div class="chart-title">测试任务总数</div>
            <div id="taskChart" class="chart"></div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import project from './project.png'
  import usecase from './usecase.png'
  import mission from './mission.png'
  import report from './report.png'
  import { onMounted, onUnmounted } from 'vue'
  
  let projectChart: echarts.ECharts | null = null
  let taskChart: echarts.ECharts | null = null
  
  const initCharts = () => {
    if (typeof echarts !== 'undefined') {
      // 初始化项目总数图表
      const projectChartContainer = document.getElementById('projectChart')
      if (projectChartContainer) {
        projectChart = echarts.init(projectChartContainer)
        projectChart.setOption({
          title: { text: '', subtext: '', left: 'center' },
          tooltip: { trigger: 'item' },
          legend: { orient: 'horizontal', left: 'left', bottom: 10 },
          series: [
            {
              name: '项目',
              type: 'pie',
              radius: ['40%', '50%'], // 修改为环形图
              data: [
                { value: 1048, name: '已完成' },
                { value: 735, name: '进行中' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }
  
      // 初始化测试任务总数图表
      const taskChartContainer = document.getElementById('taskChart')
      if (taskChartContainer) {
        taskChart = echarts.init(taskChartContainer)
        taskChart.setOption({
          title: { text: '', subtext: '', left: 'center' },
          tooltip: { trigger: 'item' },
          legend: { orient: 'horizontal', left: 'left', bottom: 10 },
          series: [
            {
              name: '任务',
              type: 'pie',
              radius: ['40%', '50%'], // 修改为环形图
              data: [
                { value: 580, name: '已完成' },
                { value: 234, name: '进行中' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }
    }
  }
  
  onMounted(() => {
    console.log('mounted')
    initCharts()
  })
  
  onUnmounted(() => {
    if (projectChart) {
      projectChart.dispose()
    }
    if (taskChart) {
      taskChart.dispose()
    }
  })
  </script>
  
  <style scoped lang="less">
  .quick-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
  }
  
  .action-item {
    text-align: center;
    display: flex;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 2px solid transparent;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
  
    div {
      margin-left: 0.5rem;
    }
  
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-color: #1890ff;
    }
  }
  
  .charts {
    display: flex;
    justify-content: space-around;
  
  }
  
  .chart-container {
    width: 280px;
    display: flex;
  }
  
  .chart-title {
    text-align: center;
    font-weight: bold;
    position: absolute;
    margin-bottom: 1rem;
  }
  
  .chart {
    width: 100%;
  }
  
  img {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.5rem;
  }
  </style>