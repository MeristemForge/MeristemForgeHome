# MeristemForge

[English](README.md)

MeristemForge 官网前端——SDK 项目展示与管理后台。

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- TypeScript、Vite、Vue Router 4、Pinia、Vue I18n 9

## 功能

**前台（公开）**
- 首页：粒子动画 Hero + 项目卡片
- 项目列表 / 项目详情（版本、平台、文件下载）

**后台（需登录）**
- 项目增删改查
- 版本管理（创建、编辑、删除）
- 文件上传 / 删除

**通用**
- 暗色 / 亮色主题切换
- 中英文国际化
- 响应式布局
- 路由过渡动画、Toast 通知、404 页面

## 快速开始

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:3000

Mock 登录凭证：`admin` / `admin`

## 构建

```bash
cd frontend
npm run build
```

产物在 `frontend/dist/`。

## API

前端通过 `/api/v1/` 前缀调用后端 REST API。开发阶段 Vite 代理到 `http://localhost:8080`。

当前使用 mock 数据层（`src/api/mock.ts`），后端就绪后在 `src/api/projects.ts` 和 `src/api/auth.ts` 中切换到真实实现即可。

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/login` | 登录 |
| GET | `/api/v1/projects` | 项目列表 |
| GET | `/api/v1/projects/:id` | 项目详情 |
| POST | `/api/v1/projects` | 创建项目 |
| PUT | `/api/v1/projects/:id` | 更新项目 |
| DELETE | `/api/v1/projects/:id` | 删除项目 |
| GET | `/api/v1/projects/:id/versions` | 版本列表 |
| POST | `/api/v1/projects/:id/versions` | 创建版本 |
| PUT | `/api/v1/versions/:id` | 更新版本 |
| DELETE | `/api/v1/versions/:id` | 删除版本 |
| POST | `/api/v1/versions/:id/files` | 上传文件 |
| DELETE | `/api/v1/files/:id` | 删除文件 |
| GET | `/api/v1/files/:id/download` | 下载文件 |

## 目录结构

```
frontend/src/
├── api/            # API 调用（mock + 真实客户端）
├── assets/         # 全局样式
├── components/     # 通用组件
├── composables/    # 组合式函数
├── i18n/           # 国际化
├── router/         # 路由
├── stores/         # Pinia 状态
├── types/          # TypeScript 类型
└── views/          # 页面
    └── admin/      # 管理后台页面
```

## 许可证

[MIT](LICENSE)
