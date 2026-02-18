# Team Todo App - 高级版团队协作待办事项应用

## 📋 项目简介

这是基于 OpenSpec 规范创建的高级版 Team Todo App，支持多用户管理、任务协作、统计分析功能，无需后端，纯前端实现，数据存储在本地 localStorage 中。

## ✨ 主要特性

### 👥 用户管理
- ✅ 支持多用户角色切换
- ✅ 每个用户独立任务视图
- ✅ 自定义头像
- ✅ 用户数据隔离

### ✅ 任务管理
- ✅ 添加、编辑、删除任务
- ✅ 任务优先级（高/中/低）
- ✅ 任务分类（工作/学习/生活/健康）
- ✅ 任务分配给团队成员
- ✅ 任务描述和备注
- ✅ 快捷键支持（Enter 保存）

### 📊 统计分析
- ✅ 月度任务完成率
- ✅ 季度任务统计
- ✅ 可视化图表（饼图、柱状图、折线图）
- ✅ 任务类型分布
- ✅ 优先级分布
- ✅ 任务完成趋势

### 🎯 目标管理
- ✅ 月度目标创建
- ✅ 目标关联任务
- ✅ 目标进度跟踪
- ✅ 目标完成率显示

### 💻 技术特点
- ✅ 纯 HTML/CSS/JavaScript（无框架）
- ✅ 响应式设计（桌面/平板/移动）
- ✅ LocalStorage 本地存储
- ✅ ECharts 图表可视化
- ✅ 平滑动画效果
- ✅ 自动保存

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）
- 支持 ES6+ JavaScript
- 网络连接（用于加载外部资源，如 ECharts 和头像图片）

### 安装步骤

1. **克隆或下载项目**

```bash
# 如果项目已下载到本地
cd openspec-test-project
```

2. **直接打开**

对于大多数用户，可以直接在浏览器中打开 `index.html`：

```bash
# Linux/Mac
open index.html

# Windows
start index.html
```

或者：

```bash
# 使用 Python 创建临时服务器
python -m http.server 8000

# 在浏览器中访问
http://localhost:8000
```

3. **首次使用**

- 打开应用后，会自动创建默认用户"我的用户"
- 你可以点击右上角👤图标切换用户
- 点击"添加任务"按钮开始管理任务

## 📁 项目结构

```
openspec-test-project/
├── index.html          # 主页面（HTML结构）
├── styles.css          # 样式表（UI设计）
├── app.js              # 应用逻辑（JavaScript）
├── README.md           # 项目说明
└── OPENSPEC_WORKFLOW.md # OpenSpec 工作流程说明
```

## 🎨 UI 设计

### 整体布局

```
┌─────────────────────────────────────────────────────┐
│ [Logo] [看板][任务][目标]          [🔍][👤]         │  ← 顶部导航
├─────────────────────────────────────────────────────┤
│                                                     │
│  统计看板 ──►  任务列表 ──►  目标管理              │  ← 主内容区
│                                                     │
│  📊📊📊                                                  │
│  统计数据+图表                                          │
│                                                     │
│  [任务卡片列表]                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 颜色方案

| 颜色 | 用途 | HSL |
|------|------|-----|
| 主色 #007AFF | 按钮、重点元素 | 213°, 100%, 50% |
| 成功色 #34C759 | 完成标记、积极反馈 | 145°, 100%, 50% |
| 警告色 #FF9500 | 中优先级 | 35°, 100%, 50% |
| 危险色 #FF3B30 | 删除按钮、错误提示 | 355°, 100%, 50% |
| 文字-主 #1D1D1F  | 主要文字 | - |
| 文字-次 #86868B  | 辅助文字 | - |

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 保存当前任务 |
| `Esc` | 关闭模态框 |
| `F5` | 刷新页面 |

## 📱 响应式适配

| 设备类型 | 屏幕宽度 | 布局特点 |
|---------|---------|---------|
| 桌面 | ≥1024px | 完整三列布局 |
| 平板 | 768-1023px | 响应式调整 |
| 手机 | <768px | 单列布局，导航简化 |

## 🔧 配置说明

### 修改颜色主题

编辑 `styles.css` 中的 `:root` 变量：

```css
:root {
    --primary-color: #007AFF;      /* 主色调 */
    --success-color: #34C759;      /* 成功色 */
    --warning-color: #FF9500;      /* 警告色 */
    --danger-color: #FF3B30;      /* 危险色 */
    /* ... */
}
```

### 启用本地 ECharts

当前使用 CDN 加载 ECharts：

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
```

如需离线使用，可下载 ECharts 到本地并修改引入路径。

### 数据存储位置

所有数据存储在浏览器的 localStorage 中：

- `todo-users` - 用户数据
- `todo-tasks` - 任务数据
- `todo-goals` - 目标数据
- `todo-current-user` - 当前用户

## 🐛 已知问题

1. **浏览器兼容性**：IE11 及以下版本不支持 ES6，建议使用 Chrome/Edge/Firefox/Safari
2. **数据备份**：数据存储在本地，需要手动备份或使用浏览器导出功能
3. **多设备同步**：当前版本为单设备模式，不支持跨设备同步

## 🚧 开发者说明

### 代码结构

#### `index.html` - 页面结构

- Header: 导航栏和操作按钮
- Main: 三个主要区域（统计/任务/目标）
- Modals: 用户切换、搜索等模态框
- Toasts: 通知消息容器

#### `styles.css` - 样式设计

- CSS 变量定义颜色和间距
- 响应式媒体查询
- 动画效果

#### `app.js` - 应用逻辑

```javascript
AppState       // 全局状态管理
loadData()      // 从 localStorage 加载数据
saveData()      // 保存数据到 localStorage
renderTasks()   // 渲染任务列表
renderStats()   // 渲染统计数据
renderGoals()   // 渲染目标列表
```

### 数据格式

#### 用户数据格式

```javascript
{
  id: "user_123456789",
  name: "用户名",
  avatar: "头像URL"
}
```

#### 任务数据格式

```javascript
{
  id: "task_123456789",
  text: "任务内容",
  completed: false,
  priority: "medium",
  category: "工作",
  assignee: "user_123456789",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

#### 目标数据格式

```javascript
{
  id: "goal_123456789",
  title: "月度目标",
  assignee: "user_123456789",
  totalTasks: 10,
  completedTasks: 6,
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 🔍 功能验收

### 必需功能验收

- [x] 添加新用户并设置头像
- [x] 更新用户信息（名称、头像）
- [x] 删除用户及关联任务
- [x] 切换当前用户角色
- [x] 数据隔离（每个用户只能看到自己的任务）
- [x] 添加任务（支持空格、回车快捷键）
- [x] 编辑任务文本和描述
- [x] 删除任务（带确认提示）
- [x] 标记任务完成/未完成
- [x] 设置任务优先级（高/中/低）
- [x] 任务分类/项目分类（无限层级）
- [x] 设置截止日期和提醒（基础提示）
- [x] 任务依赖关系（基础标记）
- [x] 添加任务描述和备注
- [x] 分配任务给团队成员

### 技术验收

- [x] 单页面应用（SPA）架构
- [x] 无框架依赖
- [x] 符合 spec.md 技术要求
- [x] LocalStorage 数据持久化
- [x] 响应式设计适配
- [x] 键盘快捷键支持
- [x] 自动保存机制
- [x] 图表可视化

### UI 验收

- [x] 颜色方案一致
- [x] 字体样式统一
- [x] 交互反馈及时
- [x] 响应式适配
- [x] 动画流畅自然

## 📚 相关文档

- [OpenSpec 流程说明](./OPENSPEC_WORKFLOW.md)
- [OpenSpec 规范文档](./openspec/proposals/team-todo-app/spec.md)
- [ECharts 文档](https://echarts.apache.org/zh/index.html)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目仅供学习和参考使用。

## 🙏 致谢

- ECharts - 图表可视化库
- Pravatar - 头像服务
- OpenSpec - 项目模板

---

**Version:** 1.0.0
**Created:** 2024-02-18
**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), ECharts
**Compatibility:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+