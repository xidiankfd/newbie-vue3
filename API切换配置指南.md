# 🔧 API切换配置指南

## 📋 切换方式总览

本项目支持通过环境变量灵活切换Mock数据和真实API，无需修改代码。

## 🎯 方式一：环境变量切换（推荐）

### 使用Mock数据（当前默认配置）
```bash
# .env.development 文件配置
VITE_USE_MOCK_API = true
```

### 切换到真实API
```bash
# .env.development 文件配置
VITE_USE_MOCK_API = false
```

## 🔗 方式二：后端服务配置

### 1. 确保后端服务运行
启动 newbie-boot3 后端项目：
```bash
cd D:\workspace\idea\newbie-boot3
mvn spring-boot:run
```
- **服务地址**: http://localhost:8090
- **API根路径**: http://localhost:8090/standard

### 2. 代理配置验证
当前Vite代理配置：
```javascript
// vite代理自动配置，将前端/api请求转发到后端
{
  "/api": "http://localhost:8090",
  "/file": "http://localhost:8090/file"
}
```

## 🚀 快速切换步骤

### 切换到真实API：
1. **修改环境变量**:
   ```bash
   # 编辑 .env.development 文件
   VITE_USE_MOCK_API = false
   ```

2. **启动后端服务**:
   ```bash
   cd D:\workspace\idea\newbie-boot3
   mvn spring-boot:run
   ```

3. **重启前端服务**:
   ```bash
   npm run dev
   ```

### 切换回Mock数据：
1. **修改环境变量**:
   ```bash
   # 编辑 .env.development 文件
   VITE_USE_MOCK_API = true
   ```

2. **重启前端服务**:
   ```bash
   npm run dev
   ```

## 🔍 验证连接状态

### 检查当前使用的API模式
在浏览器控制台中，API调用会显示：
- **Mock模式**: 延迟500ms，返回模拟数据
- **真实API**: 直接请求后端，返回数据库数据

### API请求路径对照
| 前端调用 | Mock数据 | 真实API |
|---------|---------|---------|
| `/standard/resource/page` | Mock分页响应 | `GET http://localhost:8090/standard/resource/page` |
| `标准状态选项` | Mock字典数据 | `GET http://localhost:8090/system/dict/data/getDictDataListByTypeCode/std_status` |
| `标准领域选项` | Mock字典数据 | `GET http://localhost:8090/system/dict/data/getDictDataListByTypeCode/std_field` |
| `其他字典选项` | Mock字典数据 | 暂时使用Mock数据（字典表中无对应类型） |

### 💡 重要发现
后端存在完整的系统字典模块 (`/system/dict/data`)，支持：
- **接口路径**: `/system/dict/data/getDictDataListByTypeCode/{typeCode}`
- **缓存支持**: 带有 `@Cacheable("dict")` 缓存
- **已配置字典类型**: `std_status`(标准状态)、`std_field`(标准领域)
- **权限验证**: 需要登录token

## ⚠️ 注意事项

1. **后端服务状态**: 确保后端服务在端口8090运行
2. **数据库连接**: 后端需要正确连接数据库
3. **CORS配置**: 后端已配置跨域支持
4. **环境变量生效**: 修改.env文件后需要重启开发服务器

## 🛠️ 故障排除

### Mock数据不显示
- 检查 `VITE_USE_MOCK_API` 是否为 `true`
- 确认 Mock数据文件存在：`src/mock/standardResource.js`

### 真实API无法连接
- 检查 `VITE_USE_MOCK_API` 是否为 `false`
- 确认后端服务运行在端口8090
- 浏览器控制台查看网络请求错误

### 数据格式不匹配
- 检查后端返回数据格式是否符合前端期望
- 参考API文档确认字段映射

## 📚 相关文件

- **环境配置**: `.env.development`
- **API接口**: `src/api/standard/resource.js`
- **Mock数据**: `src/mock/standardResource.js`
- **代理配置**: `vite/proxy.js`
- **后端项目**: `D:\workspace\idea\newbie-boot3`