# 渠道投放管理平台 — 前端

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.2 |
| UI 组件库 | Ant Design (antd) | 5.18 |
| 路由 | React Router DOM | 6.24 |
| HTTP 客户端 | Axios | 1.14 |
| 构建工具 | Vite | 5.3 |
| 图标 | @ant-design/icons | 5.3 |
| 语言 | JavaScript (JSX) | — |

## 运行命令

```bash
npm run dev     # 开发 http://localhost:5173
npm run build   # 生产构建
npm run preview # 预览构建产物
```

## 项目路径

- 前端根目录：`D:\360data\重要数据\我的文档\New project`
- 后端根目录：`F:\国金证券\05WEEK_04\后端\channel-platform-backend`

## 目录结构（完整）

```
src/
├── api/                           # 所有后端接口调用
│   ├── agent.js                   # AI 助手 POST /agent/chat
│   ├── auth.js                    # 登录 / 登出
│   ├── convNode.js                # 回传节点 CRUD
│   ├── convStrategy.js            # 回传策略 CRUD
│   ├── deliveryLink.js            # 投放链接 + 投放内容 + 投放平台/位置
│   ├── myConvNode.js              # 我的回传节点（审核流）
│   ├── myDeliveryScene.js         # 我的投放场景（审核流）
│   ├── myParameter.js             # 我的参数（审核流）
│   └── placementParam.js          # 投放参数 CRUD + 参数字典
├── components/
│   └── AiAssistant.jsx            # "投助" AI 悬浮聊天窗口
├── constants/
│   └── convNode.js                # 节点事件分类枚举
├── layouts/
│   └── AppLayout.jsx              # 主布局（侧边栏 + Tab + AiAssistant）
├── mock/
│   └── platformData.js            # 静态 mock 数据（部分页面仍引用）
├── pages/
│   ├── Login/index.jsx            # 登录页
│   ├── PlaceholderPage.jsx        # 占位页（未实现的菜单）
│   ├── ConvNode/index.jsx         # 回传节点管理（弹窗式 CRUD）
│   ├── callback/                  # 回传策略模块
│   │   ├── CallbackNodeListPage.jsx
│   │   ├── CallbackNodeFormPage.jsx
│   │   ├── CallbackNodeDetailPage.jsx
│   │   ├── CallbackNodeReviewListPage.jsx
│   │   ├── CallbackStrategyListPage.jsx
│   │   ├── CallbackStrategyFormPage.jsx
│   │   ├── MyConvNodeListPage.jsx
│   │   └── MyConvNodeFormPage.jsx
│   ├── channel/                   # 投放参数模块
│   │   ├── PlacementParameterListPage.jsx
│   │   ├── PlacementParameterFormPage.jsx
│   │   ├── PlacementParameterDetailPage.jsx
│   │   ├── MyParameterListPage.jsx
│   │   ├── MyParameterFormPage.jsx
│   │   ├── MyParameterDetailPage.jsx
│   │   ├── ParamDictPage.jsx
│   │   ├── PlacementReviewListPage.jsx
│   │   └── PlacementReviewDetailPage.jsx
│   └── delivery/                  # 投放场景模块
│       ├── DeliveryLinkListPage.jsx
│       ├── DeliveryLinkFormPage.jsx
│       ├── DeliveryLinkDetailPage.jsx
│       ├── MyDeliverySceneListPage.jsx
│       ├── MyDeliverySceneFormPage.jsx
│       └── DeliverySceneReviewListPage.jsx
├── router/
│   ├── AuthGuard.jsx              # JWT 路由守卫
│   └── routeMeta.jsx              # 路由元数据 + 侧边栏菜单配置
├── styles/
│   ├── global.css                 # 全局样式（布局 / 表格 / 表单 / 响应式）
│   └── ai-assistant.css           # 投助悬浮窗样式
├── utils/
│   ├── request.js                 # Axios 实例（baseURL / JWT 拦截器 / 401 跳转）
│   └── format.js                  # formatDateTime 工具
├── App.jsx                        # 路由定义（useRoutes）
└── main.jsx                       # 入口（BrowserRouter + ConfigProvider 中文国际化）
```

## 已实现模块

| 模块 | 页面 | 状态 |
|------|------|------|
| 登录认证 | 登录页 + AuthGuard 守卫 | ✅ |
| 投放参数管理 | 列表 / 新增 / 编辑 / 详情 / 字典表 | ✅ |
| 投放参数配置（我的参数） | 列表 / 新增 / 编辑 / 详情 + 提交/归档 | ✅ |
| 投放参数审核 | 审核列表 / 审核详情（通过/驳回） | ✅ |
| 回传节点管理 | 列表 / 新增 / 编辑 / 详情 | ✅ |
| 回传策略配置 | 列表 / 新增策略（关联多节点） | ✅ |
| 回传策略审核 | 占位页 | 🔲 |
| 我的回传节点 | 列表 + 提交/归档 | ✅ |
| 回传节点审核 | 审核列表 | ✅ |
| 投放场景配置 | 列表 / 新增 / 编辑 / 详情（含参数拼接 + 短链生成） | ✅ |
| 我的投放场景 | 列表 + 提交/归档 | ✅ |
| 投放场景审核 | 审核列表 | ✅ |
| 投放内容 / 平台 / 位置管理 | 弹窗内 CRUD（嵌在投放链接表单内） | ✅ |
| deeplink 管理 | 占位页 | 🔲 |
| 银证渠道回传管理 | 占位页 | 🔲 |
| AI 助手（投助） | 悬浮聊天窗 + Function Calling | ✅ |

## 开发注意事项

### 主题色
- 主色 `#1a56a0`（ConfigProvider token.colorPrimary）
- AI 助手组件用 `#1a56db`
- 侧边栏背景 `#1a56a0`，选中态 `rgba(255,255,255,0.16)`

### API 代理 / baseURL
- Vite proxy：`/api` → `http://localhost:8080`
- `request.js` baseURL：`http://localhost:8080/api`（直连）
- 后端 `context-path: /api`，所以前端 API 路径 **不带** `/api` 前缀
  例如 `request.get('/channel/conv-nodes')`

### 认证
- JWT token 存 `localStorage.token`
- 用户信息存 `localStorage.userInfo`（JSON 字符串）
- 401 响应自动清 token 并跳转 `/login`
- `AuthGuard` 组件包裹 `AppLayout`，未登录重定向 `/login`

### AI 助手（投助）
- 组件渲染在 `AppLayout.jsx` 内，所有已登录页面右下角可见
- 对话历史存前端 React state，不做持久化
- 后端 `POST /api/agent/chat` 支持 Claude Function Calling
- Tools：`query_params`、`get_param_detail`、`create_param_application`
- Claude API 通过代理 `https://api.aipaibox.com` 调用
