# %%PROJECT_NAME%%

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6.6-1677FF?logo=antdesign&logoColor=white)](https://ant.design/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7%20native-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![CSR](https://img.shields.io/badge/rendering-pure%20CSR-0F766E)](#架构约束)
[![License](https://img.shields.io/badge/license-MIT-22C55E)](./LICENSE)

基于 React 19、TanStack Router 与 Ant Design 6 的纯 CSR 管理后台。项目提供完整的认证、权限、导航、页签状态保留（keep alive）、主题、国际化、业务表格与表单能力，同时包含可分发的项目脚手架和页面生成器。

## 项目来源

项目最初参考 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) 的产品思路与功能覆盖，并在 React 技术栈中重新设计、适配与升级。当前代码、组件模型、状态管理、路由和工程体系均按 React 生态独立实现。

## 核心能力

- React 19 `Activity` 驱动的多页签状态保留（keep alive）、刷新、固定、排序和批量关闭。
- TanStack Router 文件路由负责 URL、搜索参数、加载器和权限守卫；页面注册表负责菜单与可见页面渲染。
- 基于角色的菜单过滤、直接访问保护，以及浏览器本地演示认证。
- Ant Design 6 主题令牌、明暗模式、紧凑密度、响应式布局和三语言界面。
- 可组合的 `QueryForm` 与 `ProTable`：查询折叠、重置、工具栏、刷新、密度、列设置、全屏、分页与选择反馈开箱即用。
- TanStack Query、TanStack Store、Zod、Tiptap、Motion 等 React 生态能力。
- 89 个独立功能页面和 4 个辅助状态页，覆盖仪表盘、通用演示、业务示例与系统管理。
- `create-qing` 完整项目脚手架，以及同时写入功能声明、页面和显式路由的生成器。

## 技术基线

| 层级       | 当前配置                                      |
| ---------- | --------------------------------------------- |
| UI         | React 19.2、Ant Design 6.6                    |
| 路由       | TanStack Router 文件路由，纯浏览器运行        |
| 数据与状态 | TanStack Query、TanStack Store、Zod           |
| 构建       | Vite 8、React Compiler                        |
| 类型       | TypeScript 7 原生检查 + TypeScript 6 兼容检查 |
| 质量       | Oxlint、Oxfmt、Vitest、Playwright             |

## 快速开始

环境要求：Node.js 24.20 或更高版本，pnpm 11。

```sh
pnpm install
pnpm dev
```

打开 `http://localhost:5173`，可使用以下演示账号，密码均为 `123456`：

- `super`：超级管理员
- `admin`：管理员
- `user`：普通用户

演示认证只用于浏览器本地体验。生产环境必须接入服务端认证与授权，不能把本地角色数据当作安全边界。

## 目录结构

```text
apps/web-admin/        管理后台应用、单元测试与静态资源
packages/create-qing/  可分发的项目脚手架与页面生成器
.agents/skills/        仓库专用实现、生成与质量技能
scripts/               路由、模板和 CSR 构建检查脚本
tests/e2e/             Playwright 端到端测试
```

## 生成项目与页面

创建完整的独立项目：

```sh
# 在当前仓库中
pnpm create:admin -- /tmp/my-admin --name my-admin --no-install

# 使用已发布的 CLI
pnpm dlx create-qing create my-admin
```

生成一个自注册的受保护功能切片：

```sh
pnpm generate -- page orders \
  --route /business/orders \
  --title 订单管理 \
  --title-tw 訂單管理 \
  --title-en Orders \
  --group system \
  --roles admin
```

生成器只创建 `features/<路由>/feature.ts`、`page.tsx` 和对应 TanStack 文件路由。功能清单内聚菜单分组、权限、三语言文案与懒加载；Vite 自动发现它，不再修改中心注册表或全局 i18n。可先加 `--dry-run` 查看变更目标。

## 架构约束

TanStack 文件路由负责 URL 匹配、守卫、加载器和搜索参数校验；`features/**/feature.ts` 负责功能元数据与懒加载，`core/page-registry.tsx` 自动发现功能，`ActivityPageHost` 保留已打开页签的组件状态。新增功能无需编辑共享注册文件。

应用仅输出静态 CSR 资源，不包含 SSR、TanStack Start、服务端函数或服务端 bundle。生产静态主机必须将未知应用路径回写到 `/index.html`。

## 质量验证

```sh
pnpm check
pnpm test:e2e
antd lint apps/web-admin/src --format json
```

`pnpm check` 覆盖路由与模板一致性、格式、类型感知 lint、生产构建、两套 TypeScript 检查、单元测试、覆盖率和 Agent Skill 结构检查。

## 构建与部署

```sh
pnpm build
pnpm preview
```

构建产物位于 `apps/web-admin/dist`。部署到任意静态托管平台时，为 History API 路由配置 SPA fallback 即可。

## 鸣谢

感谢 [vue-vben-admin](https://github.com/vbenjs/vue-vben-admin) 提供的产品思路，以及 [OpenAI Codex](https://openai.com/codex/) 在架构梳理、功能实现与质量验证中提供的协作支持。

## 开源协议

项目基于 [MIT License](./LICENSE) 开源。
