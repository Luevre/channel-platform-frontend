# 渠道投放管理平台 - 前端

## 项目概述
这是一个 React + Ant Design 的渠道投放管理平台前端应用。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18.2.0 |
| UI组件库 | Ant Design 5.18.3 |
| 路由 | React Router DOM 6.24.1 |
| HTTP客户端 | Axios 1.14.0 |
| 构建工具 | Vite 5.3.4 |
| 图标 | @ant-design/icons 5.3.7 |

## 项目结构

```
src/
├── api/                    # API 请求封装
│   ├── auth.js            # 认证相关接口
│   ├── convNode.js        # 回传节点接口
│   ├── convStrategy.js    # 回传策略接口
│   ├── deliveryLink.js    # 投放链接接口
│   ├── myParameter.js      # 我的参数接口
│   └── placementParam.js   # 投放参数接口
├── constants/             # 常量定义
│   └── convNode.js        # 回传节点常量
├── layouts/               # 布局组件
│   └── AppLayout.jsx      # 应用主布局
├── mock/                  # Mock 数据
│   └── platformData.js    # 平台数据
├── pages/                 # 页面组件
│   ├── Login/             # 登录页
│   ├── callback/          # 回传管理
│   │   ├── CallbackNodeFormPage.jsx
│   │   ├── CallbackNodeListPage.jsx
│   │   ├── CallbackStrategyFormPage.jsx
│   │   └── CallbackStrategyListPage.jsx
│   ├── channel/           # 渠道管理
│   │   ├── MyParameterFormPage.jsx
│   │   ├── MyParameterListPage.jsx
│   │   ├── PlacementParameterDetailPage.jsx
│   │   ├── PlacementParameterFormPage.jsx
│   │   ├── PlacementParameterListPage.jsx
│   │   ├── PlacementReviewDetailPage.jsx
│   │   └── PlacementReviewListPage.jsx
│   ├── delivery/          # 投放管理
│   │   ├── DeliveryLinkFormPage.jsx
│   │   └── DeliveryLinkListPage.jsx
│   └── ConvNode/          # 回传节点管理
├── router/                # 路由配置
│   ├── AuthGuard.jsx      # 路由守卫
│   └── routeMeta.jsx     # 路由元信息
├── styles/                # 样式文件
│   └── global.css         # 全局样式
├── utils/                 # 工具函数
│   ├── format.js          # 格式化工具
│   └── request.js         # axios 封装
├── App.jsx                # 根组件
└── main.jsx               # 入口文件
```

## 关键文件说明

### 入口文件
- `src/main.jsx` - 应用入口，配置了 BrowserRouter 和 Ant Design ConfigProvider

### API 封装
- `src/utils/request.js` - 基于 axios 的请求封装，包含拦截器和 token 管理

### 页面路由
- `src/App.jsx` - 定义了应用的路由结构

## 开发偏好

1. **代码交付方式**：提供完整的文件供替换，而非分步编辑
2. **确认机制**：修改前分步确认，确保方向正确后再继续
3. **UI 风格**：使用 Ant Design 统一风格，主色调 #1a56a0，圆角 8px

## 启动命令

```bash
npm run dev     # 开发模式
npm run build   # 生产构建
npm run preview # 预览构建结果
```