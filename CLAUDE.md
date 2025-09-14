# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作时提供指导。

## 🌐 语言规范
- 所有对话和文档必须使用中文

## 常用开发命令

### 开发和构建
```bash
# 启动开发服务器
pnpm dev
# 或者
npm run dev

# 构建生产版本
pnpm build
# 或者
npm run build

# 预览构建结果
pnpm preview
# 或者
npm run preview

# 代码检查
pnpm lint
# 或者
npm run lint

# 自动修复代码格式问题
pnpm lint:fix
# 或者
npm run lint:fix
```

### 包管理
项目使用 pnpm 作为包管理工具，有 `preinstall` 脚本强制使用 pnpm。

## 项目架构

### 技术栈
- **框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5.3+
- **状态管理**: Pinia with persistence plugin
- **路由**: Vue Router 4.4+
- **UI组件库**: Element Plus 2.7+
- **CSS框架**: TailwindCSS 3.4+
- **国际化**: Vue I18n 9.13+
- **HTTP客户端**: Axios 1.7+
- **代码规范**: @antfu/eslint-config
- **图表**: ECharts 5.5+
- **图标**: @element-plus/icons-vue + @iconify/vue

### 核心目录结构
```
src/
├── api/                    # API接口定义 (按模块分组)
│   ├── system/            # 系统管理相关接口
│   ├── monitor/           # 监控相关接口
│   └── dev-tool/          # 开发工具接口
├── components/            # 全局组件
├── views/                 # 页面视图 (按功能模块分组)
├── layout/                # 布局组件
├── stores/                # Pinia状态管理
│   └── modules/          # 模块化store
├── router/                # 路由配置
├── i18n/                 # 国际化配置
├── utils/                # 工具函数
├── hooks/                # 自定义Hooks
├── directives/           # 自定义指令
└── assets/               # 静态资源
```

### 状态管理架构
使用 Pinia 进行状态管理，支持数据持久化：
- `stores/modules/app.js` - 应用全局配置和主题设置
- `stores/modules/user.js` - 用户信息和认证状态
- `stores/modules/route.js` - 动态路由管理
- 使用 `pinia-plugin-persistedstate` 实现状态持久化

### 路由架构
- **动态路由加载**: 支持前端和后端两种路由加载策略 (配置在 `appConfig.js`)
- **权限控制**: 基于角色的路由守卫，白名单机制
- **路由懒加载**: 所有页面组件采用懒加载方式
- **面包屑和标签页**: 自动生成基于路由的导航

### 布局系统
支持多种布局模式 (在 `appConfig.js` 中配置):
- `default` - 默认单侧栏布局
- `doubleAside` - 双侧栏布局
- `crosswise` - 横向上下布局
- `mixture` - 混合导航布局

### 主题系统
- 支持多主题切换 (默认/暗黑/樱花粉/天空蓝/草原绿/幻想主题)
- TailwindCSS dark mode 支持
- Element Plus 组件主题自定义
- 灰色模式和色弱模式支持

### API架构
- 统一的axios实例配置
- API按业务模块组织 (`api/system/`, `api/monitor/` 等)
- 支持Mock数据 (使用 vite-plugin-mock)
- 环境变量配置的API代理

### 组件规范
- 全局注册的基础组件: `SvgIcon`, `DictTag`, `DictSelect`
- 字典数据组件支持客户端缓存
- SVG图标系统使用 vite-plugin-svg-icons

### 开发工具集成
- ESLint使用 @antfu 配置规范
- 支持在线代码生成器功能
- 集成开发者工具模块

### 环境配置
项目支持多环境配置：
- `.env` - 基础环境变量
- `.env.development` - 开发环境
- `.env.production` - 生产环境

关键环境变量包括：
- `VITE_APP_BASE_PATH` - 应用基础路径
- `VITE_APP_PORT` - 开发服务器端口
- `VITE_APP_TITLE` - 应用标题

### 国际化
- 默认支持中文简体、中文繁体、英文
- 路由标题自动国际化
- Element Plus组件国际化支持

## Views 业务模块详细说明

### 🏠 home (首页模块)
- **主要功能**: 系统首页仪表盘
- **组件**: `src/views/home/index.vue`
- **特点**: 数据概览、图表展示、快捷入口

### 🔐 login (登录模块)
- **主要功能**: 用户身份验证和系统初始化
- **组件**:
  - `index.vue` - 登录页面主入口，集成多种登录方式
  - `Login.vue` - 标准用户名密码登录组件
  - `AdminInit.vue` - 系统管理员初始化组件
- **特点**:
  - 支持管理员初始化功能 (可在 `appConfig.js` 中配置)
  - 多种登录方式预留 (手机号、邮箱登录)
  - 美观的登录页面设计

### 👤 personalCenter (个人中心)
- **主要功能**: 用户个人信息管理
- **组件**: `src/views/personalCenter/index.vue`
- **功能**: 个人资料修改、密码修改、个人设置

### 🛠️ system (系统管理模块)
核心的系统管理功能模块，包含完整的RBAC权限管理体系。

#### 👥 user (用户管理)
- **主要功能**: 系统用户的全生命周期管理
- **组件**:
  - `index.vue` - 用户列表页面，支持按部门查询
  - `UserForm.vue` - 用户信息新增/编辑表单
  - `UpdateUserPassword.vue` - 用户密码修改组件
- **特点**:
  - 树形部门结构查询
  - 用户性别字典支持
  - 批量删除功能
  - 密码独立管理

#### 🏢 dept (部门管理)
- **主要功能**: 组织架构管理
- **组件**:
  - `index.vue` - 部门树形列表
  - `DeptForm.vue` - 部门新增/编辑表单
- **特点**: 树形结构展示和操作

#### 🎭 role (角色管理)
- **主要功能**: 角色权限管理
- **组件**:
  - `index.vue` - 角色列表管理
  - `RoleForm.vue` - 角色信息表单
  - `PermissionAllocation.vue` - 角色权限分配
  - `UserAllocation.vue` - 角色用户分配
- **特点**:
  - 角色-权限关联管理
  - 角色-用户关联管理
  - 支持角色状态管理

#### 📋 menu (菜单管理)
- **主要功能**: 系统菜单和权限管理
- **组件**:
  - `index.vue` - 菜单树形管理
  - `MenuForm.vue` - 菜单新增/编辑表单
- **特点**: 树形菜单结构，支持动态路由生成

#### 📖 dictType (字典类型管理)
- **主要功能**: 数据字典类型管理
- **组件**:
  - `index.vue` - 字典类型列表
  - `DictTypeForm.vue` - 字典类型表单
- **特点**: 系统字典的类型定义和管理

#### 📝 dictData (字典数据管理)
- **主要功能**: 字典数据项管理
- **组件**:
  - `index.vue` - 字典数据列表
  - `DictDataForm.vue` - 字典数据表单
  - `DictTypeSelect.vue` - 字典类型选择组件
- **特点**:
  - 按字典类型分组管理数据项
  - 支持字典数据排序
  - 客户端缓存支持

### 📊 monitor (系统监控模块)
系统运行状态监控和日志管理。

#### 📈 serverMonitor (服务器监控)
- **主要功能**: 服务器性能实时监控
- **组件**: `src/views/monitor/serverMonitor/index.vue`
- **功能**:
  - JVM 信息监控 (内存、GC等)
  - 操作系统信息
  - CPU 使用率监控
  - 内存使用情况
  - 磁盘空间监控
  - 网络信息展示
- **特点**: 实时数据刷新、可视化图表展示

#### 📋 logLogin (登录日志)
- **主要功能**: 用户登录行为记录
- **组件**: `src/views/monitor/logLogin/index.vue`
- **功能**: 登录成功/失败记录、IP地址、登录时间等

#### 📄 logOperate (操作日志)
- **主要功能**: 用户操作行为审计
- **组件**: `src/views/monitor/logOperate/index.vue`
- **功能**: 操作模块、操作类型、操作时间、操作结果记录

### 🛠️ dev-tool (开发工具模块)
面向开发者的代码生成和配置管理工具。

#### ⚙️ generator (代码生成器)
- **主要功能**: 基于数据库表结构自动生成CRUD代码
- **组件**:
  - `index.vue` - 数据库表列表和生成操作
  - `SelectConfigVue.vue` - 生成配置选择组件
- **功能**:
  - 数据库表扫描
  - 自定义生成模板
  - 批量代码生成
  - 文件下载功能
- **特点**: 提高开发效率的核心工具

#### 🔧 genConfig (生成配置)
- **主要功能**: 代码生成器的配置管理
- **组件**:
  - `index.vue` - 配置列表管理
  - `GenConfigDataForm.vue` - 配置数据表单
- **功能**: 生成模板配置、字段映射配置

### 📋 standardResource (标准资源模块)
行业标准和规范管理模块。

#### 📚 主要功能
- **组件**:
  - `index.vue` - 标准资源列表和搜索
  - `detail.vue` - 标准详情页面
  - `applicationSupport.vue` - 应用支持页面
  - `digitalContent.vue` - 数字化内容管理
- **功能**:
  - 标准资源检索 (支持多维度筛选)
  - 标准分类管理 (国家标准、行业标准、团体标准等)
  - 标准状态跟踪 (现行、废止、即将实施)
  - 应用支持和数字化内容管理
- **特点**:
  - 丰富的筛选条件
  - 标准资源的标准化管理
  - 支持关键词搜索

### ❌ error-page (错误页面)
- **主要功能**: 系统异常情况处理页面
- **组件**:
  - `NotFound.vue` - 404 页面未找到
  - `NotPermission.vue` - 403 权限不足页面
- **特点**: 友好的错误提示和导航

### 🧪 demo (演示模块)
- **主要功能**: 功能演示和测试
- **组件**: `UploadTest.vue` - 文件上传测试组件
- **用途**: 开发测试和功能演示

## 开发建议

### 新增业务模块时的最佳实践
1. **目录结构**: 按模块功能创建对应目录，保持与现有结构一致
2. **命名规范**:
   - 页面组件使用 `index.vue` 作为主入口
   - 表单组件使用 `[模块名]Form.vue`
   - 功能组件采用描述性命名
3. **API调用**: 在 `src/api/` 对应模块下创建API文件
4. **路由配置**: 在 `src/router/modules/` 下添加路由配置
5. **权限控制**: 配合后端菜单管理实现页面级权限控制
6. **国际化**: 新增页面需要在 `src/i18n/` 中添加对应的多语言文本

### 表单和列表页面开发规范
- 使用 `usePagingParams` hook 处理分页参数
- 统一的查询、重置、新增、编辑、删除操作模式
- Element Plus 表格和表单组件的标准化使用
- 响应式数据管理使用 `reactive` 和 `ref`

## 后端项目架构 (newbie-boot3)

### 🏗️ 技术架构
- **框架**: Spring Boot 3.2.4 + JDK 21
- **数据库**: 支持 MySQL、PostgreSQL、Oracle 多数据源
- **缓存**: Redis (Lettuce连接池)
- **认证鉴权**: Sa-Token 1.37.0
- **ORM**: MyBatis Plus
- **工具库**: Hutool 5.8.26
- **文件存储**: 本地存储 + MinIO 8.4.3
- **API文档**: SpringDoc OpenAPI 3
- **构建工具**: Maven

### 📁 模块结构
```
newbie-boot3/
├── newbie-admin/           # 后台管理接口入口模块
├── newbie-common/          # 公共工具和基础配置
├── newbie-security/        # 认证鉴权模块
├── newbie-system/          # 系统管理模块
├── newbie-file/           # 文件服务模块
├── newbie-standard/       # 标准资源管理模块
├── newbie-weblog/         # Web日志记录模块
└── newbie-generator/      # 代码生成器模块
```

### 🔌 API接口架构

#### 🔐 认证鉴权接口 (/security)
**SecurityController** - 用户认证和权限管理
- `POST /security/login` - 用户登录
- `GET /security/imageCaptcha` - 获取图片验证码
- `POST /security/initAdmin` - 系统管理员初始化
- `GET /security/userInfo` - 获取当前用户信息
- `GET /security/routes` - 获取用户路由权限
- `POST /security/logout` - 用户退出登录
- `POST /security/updatePassword` - 修改密码

#### 👥 系统管理接口 (/system)

##### 用户管理 (/system/user)
**SysUserController** - 用户CRUD操作
- `GET /system/user/paging` - 分页查询用户列表
- `POST /system/user/add` - 新增用户
- `POST /system/user/update` - 修改用户信息
- `DELETE /system/user/deleteBatch` - 批量删除用户
- `POST /system/user/updatePassword` - 修改用户密码
- `GET /system/user/export` - 导出用户数据

##### 角色管理 (/system/role)
**SysRoleController** - 角色权限管理
- `GET /system/role/paging` - 分页查询角色列表
- `POST /system/role/add` - 新增角色
- `POST /system/role/update` - 修改角色
- `DELETE /system/role/deleteBatch` - 批量删除角色

##### 部门管理 (/system/dept)
**SysDeptController** - 组织架构管理
- `GET /system/dept/tree` - 获取部门树形结构
- `POST /system/dept/add` - 新增部门
- `POST /system/dept/update` - 修改部门

##### 菜单管理 (/system/menu)
**SysMenuController** - 菜单权限管理
- `GET /system/menu/tree` - 获取菜单树形结构
- `POST /system/menu/add` - 新增菜单
- `POST /system/menu/update` - 修改菜单

##### 字典管理
**SysDictTypeController** - 字典类型管理
- `GET /system/dictType/paging` - 分页查询字典类型
- `POST /system/dictType/add` - 新增字典类型
- `POST /system/dictType/update` - 修改字典类型

**SysDictDataController** - 字典数据管理
- `GET /system/dictData/paging` - 分页查询字典数据
- `POST /system/dictData/add` - 新增字典数据
- `POST /system/dictData/update` - 修改字典数据
- `GET /system/dictData/listByDictType/{dictType}` - 根据字典类型获取数据

#### 📊 系统监控接口 (/monitor)

##### 服务器监控 (/monitor/server)
**SysServerController** - 服务器性能监控
- `GET /monitor/server/info` - 获取服务器运行信息 (JVM、CPU、内存、磁盘等)

##### 登录日志 (/monitor/logLogin)
**SysLogLoginController** - 登录行为审计
- `GET /monitor/logLogin/paging` - 分页查询登录日志
- `DELETE /monitor/logLogin/deleteBatch` - 批量删除登录日志

##### 操作日志 (/monitor/logOperate)
**SysLogOperateController** - 操作行为审计
- `GET /monitor/logOperate/paging` - 分页查询操作日志
- `DELETE /monitor/logOperate/deleteBatch` - 批量删除操作日志

#### 📋 标准资源管理接口 (/standard)

##### 标准资源核心 (/standard/resource)
**StdResourceController** - 标准资源主体管理
- `GET /standard/resource/page` - 分页查询标准资源列表
- `GET /standard/resource/{id}` - 获取标准资源详情
- `POST /standard/resource` - 新增标准资源
- `PUT /standard/resource` - 更新标准资源
- `DELETE /standard/resource/{ids}` - 批量删除标准资源

##### 标准资源附件 (/standard/attachment)
**StdResourceAttachmentController** - 标准资源附件管理
- `GET /standard/attachment/page` - 分页查询附件列表
- `POST /standard/attachment` - 新增附件
- `DELETE /standard/attachment/{ids}` - 删除附件

##### 标准资源参考 (/standard/reference)
**StdResourceReferenceController** - 标准资源引用关系
- `GET /standard/reference/page` - 分页查询引用关系
- `POST /standard/reference` - 新增引用关系
- `DELETE /standard/reference/{ids}` - 删除引用关系

##### 标准术语 (/standard/terminology)
**StdTerminologyController** - 标准术语管理
- `GET /standard/terminology/page` - 分页查询术语列表
- `POST /standard/terminology` - 新增术语
- `PUT /standard/terminology` - 更新术语
- `DELETE /standard/terminology/{ids}` - 删除术语

##### 标准解释 (/standard/interpretation)
**StdInterpretationController** - 标准解释说明管理
- `GET /standard/interpretation/page` - 分页查询解释列表
- `POST /standard/interpretation` - 新增解释
- `PUT /standard/interpretation` - 更新解释
- `DELETE /standard/interpretation/{ids}` - 删除解释

#### 📁 文件服务接口 (/file)
**FileController** - 文件上传下载管理
- `POST /file/upload` - 文件上传
- `GET /file/download/{fileName}` - 文件下载
- `GET /public/**` - 公共文件访问 (无需认证)

### ⚙️ 核心配置

#### 认证鉴权配置 (Sa-Token)
- **Token有效期**: 1800秒 (30分钟)
- **白名单路径**: 登录、验证码、公共文件、标准资源接口等
- **权限注解**: `@SaCheckPermission` 进行方法级权限控制

#### 数据库配置
- **支持多数据源**: MySQL、PostgreSQL、Oracle
- **默认数据源**: PostgreSQL (localhost:5432/postgres)
- **ORM**: MyBatis Plus (关闭banner)

#### 缓存配置 (Redis)
- **连接**: localhost:6379
- **连接池**: Lettuce (最大连接200，最大空闲10)
- **超时时间**: 10秒

#### 文件服务配置
- **存储方案**: 支持本地存储和MinIO
- **本地存储路径**: D:/project/upload
- **文件访问前缀**: /public
- **上传限制**: 最大文件200MB

#### 日志配置
- **Web日志**: 可配置记录所有接口或仅错误日志
- **策略**: all_api (记录所有接口) 或 default (仅记录注解接口)
- **日志级别**: 支持DEBUG级别调试输出

### 🔄 前后端接口对接规范

#### API响应格式
```json
{
  "code": 200,
  "data": {...},
  "msg": "操作成功",
  "success": true
}
```

#### 分页参数格式
- `current`: 当前页码
- `size`: 每页大小
- 返回: `{records: [], total: 0, current: 1, size: 10}`

#### 权限验证
- 前端路由守卫检查token
- 后端使用 `@SaCheckPermission` 注解验证接口权限
- 白名单路径无需token验证

#### 错误处理
- 全局异常处理器统一返回错误格式
- 前端axios拦截器统一处理错误响应
- 支持DEBUG级别日志输出调试信息