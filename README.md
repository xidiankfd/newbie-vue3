# NewbieVue3

<div align="center">

一个基于 Vue 3 + Vite 的现代化后台管理系统解决方案

[![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.7+-409EFF?style=flat-square&logo=element&logoColor=white)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

## ✨ 特性

- 🚀 **最新技术栈**: Vue 3.4+ Composition API, Vite 5.3+, Pinia 状态管理
- 💡 **TypeScript Ready**: 支持 TypeScript 开发 (可选)
- 🎨 **丰富UI组件**: Element Plus + TailwindCSS 双重UI解决方案
- 🌍 **国际化支持**: 内置中文简体/繁体/英文多语言支持
- 🎯 **权限管理**: 基于角色的权限控制和动态路由
- 🎨 **多主题切换**: 支持亮色/暗色主题及多套配色方案
- 📱 **响应式设计**: 支持桌面端和移动端适配
- 🛠️ **开发工具**: 集成代码生成器、系统监控等开发者工具
- ⚡ **性能优化**: 路由懒加载、组件按需加载
- 📦 **工程化**: ESLint + 自动化部署配置

## 🏗️ 功能模块

### 核心功能
- 📊 **仪表盘**: 数据概览和可视化图表
- 👥 **用户管理**: 用户信息管理、角色分配
- 🔐 **权限管理**: 菜单权限、角色权限、部门管理
- 📝 **系统管理**: 字典管理、系统配置
- 📈 **系统监控**: 登录日志、操作日志、服务器监控

### 开发工具
- 🛠️ **代码生成器**: 在线生成CRUD代码
- ⚙️ **配置管理**: 动态配置管理工具
- 📋 **标准资源**: 资源模板和标准化工具

### 页面功能
- 🔑 **登录注册**: 支持管理员初始化
- 👤 **个人中心**: 个人信息管理
- ❌ **错误页面**: 404、403 等错误页面处理

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0
- pnpm >= 8.0 (推荐) 或 npm >= 7.0

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd newbie-vue3

# 安装依赖 (推荐使用 pnpm)
pnpm install

# 或使用 npm
npm install
```

### 启动开发

```bash
# 启动开发服务器
pnpm dev

# 浏览器访问 http://localhost:9999
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## ⚙️ 环境配置

### 开发环境配置 (.env.development)

```env
# 开发服务器端口
VITE_APP_PORT = 9999

# API 代理配置
VITE_API_BASE_URL = /api
VITE_FILE_BASE_URL = /file
VITE_DEV_PROXY = {"/api":"http://localhost:8080","/file":"http://localhost:8080/file"}

# 请求超时设置
VITE_API_TIMEOUT = 10000
```

### 生产环境配置 (.env.production)

根据实际部署环境修改相应配置。

## 🎨 主题定制

项目支持多种主题和布局模式：

### 内置主题
- 默认主题
- 暗黑主题
- 樱花粉主题
- 天空蓝主题
- 草原绿主题
- 幻想主题

### 布局模式
- 默认单侧栏
- 双侧栏布局
- 横向上下布局
- 混合导航布局

在 `src/appConfig.js` 中可以配置默认主题和布局。

## 📁 项目结构

```
newbie-vue3/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── system/        # 系统管理接口
│   │   ├── monitor/       # 监控相关接口
│   │   └── dev-tool/      # 开发工具接口
│   ├── assets/            # 资源文件
│   ├── components/        # 全局组件
│   ├── directives/        # 自定义指令
│   ├── hooks/             # 自定义 Hooks
│   ├── i18n/              # 国际化配置
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── stores/            # Pinia 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件
│   └── appConfig.js      # 应用配置
├── vite/                  # Vite 配置
├── .env                   # 环境变量
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── vite.config.js         # Vite 配置
├── tailwind.config.js     # TailwindCSS 配置
└── package.json           # 项目配置
```

## 🛠️ 开发指南

### 代码规范

项目使用 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 作为代码规范。

```bash
# 代码检查
pnpm lint

# 自动修复代码格式问题
pnpm lint:fix
```

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/modules/` 下添加路由配置
3. 在后端配置对应的菜单权限(如果使用后端路由)

### 添加新的 API

1. 在 `src/api/` 对应模块下创建 API 文件
2. 使用统一的 axios 实例
3. 按照现有模式进行接口定义

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [TailwindCSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️**

</div>