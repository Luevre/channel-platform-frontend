# 渠道投放管理平台 — 前端

> 国金证券线上渠道投放管理平台的前端工程，基于 **React 18 + Vite 5 + Ant Design 5 + React Router 6** 构建。

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2 | 前端框架 |
| Vite | 5.3 | 构建工具，开发秒启 |
| Ant Design | 5.18 | UI 组件库 |
| React Router | 6.24 | 前端路由 |
| Axios | 1.14 | HTTP 请求 |
| @ant-design/icons | 5.3 | 图标库 |

---

## 功能模块

| 模块 | 路由前缀 | 状态 |
|------|----------|------|
| 投放参数管理（列表/新增/编辑/查看） | `/channel/placement-params` | 已完成 |
| 我的参数管理（列表/新增/审核） | `/channel/my-params` | 已完成 |
| 投放参数审核（列表/详情） | `/channel/placement-review` | 已完成 |
| 回传节点管理（列表/新增/编辑） | `/callback/node-management` | 已完成 |
| 回传策略管理（列表/新增） | `/callback/strategy-management` | 已完成 |
| 投放链接管理（列表/新增/编辑） | `/delivery/link-management` | 已完成 |
| DeepLink 管理 | `/delivery/deeplink` | 占位 |
| 公域数据管理 | `/public/data-management` | 占位 |
| 渠道投放成效管理 | `/report/performance` | 占位 |
| 登录 / JWT 鉴权 | `/login` | 已完成 |

---

## 项目结构

```
src/
├── api/                  # API 请求封装（auth / convNode / placementParam 等）
├── constants/            # 常量定义
├── layouts/
│   └── AppLayout.jsx     # 主布局：左侧深蓝色导航 + 右侧多 Tab 内容区
├── mock/
│   └── platformData.js   # 本地 mock 数据
├── pages/
│   ├── callback/         # 回传节点 & 回传策略
│   ├── channel/          # 投放参数 & 我的参数 & 参数审核
│   ├── delivery/         # 投放链接
│   ├── ConvNode/         # 回传节点独立页
│   ├── Login/            # 登录页
│   └── PlaceholderPage.jsx
├── router/
│   ├── AuthGuard.jsx     # 路由鉴权守卫
│   └── routeMeta.jsx     # 路由元信息 & 菜单配置
├── styles/
│   └── global.css        # 全局样式
├── utils/
│   └── request.js        # Axios 实例 & 拦截器
├── App.jsx               # 路由定义
└── main.jsx              # 入口
```

---

## 快速启动

### 环境要求

- **Node.js** >= 18
- **npm** >= 9

### 安装 & 运行

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产包
npm run build

# 预览生产构建
npm run preview
```

---

## 与后端对接

前端通过 Axios 拦截器自动附加 `Authorization: Bearer <token>` 请求头。

- 后端 API 基地址：`http://localhost:8080/api`
- 登录接口：`POST /api/auth/login`
- 若收到 401 响应，自动跳转至登录页

可在 `vite.config.js` 中配置 `server.proxy` 将 `/api` 代理到后端地址以解决开发环境跨域问题。

---

## 设计特性

- **多 Tab 模式**：右侧内容区支持多页签打开、切换和关闭
- **左侧固定导航**：深蓝色侧边栏，标题”综合服务平台”
- **JWT 鉴权**：登录后 Token 存储在 localStorage，AuthGuard 路由守卫保护所有页面
- **Mock 数据**：可在无后端情况下独立运行，使用本地 mock 数据
