# Next.js 表格应用

这是一个基于 Next.js 14 构建的现代化表格应用，具有虚拟滚动、动态加载、数据编辑等功能。使用了 Supabase 作为后端数据库。

## 主要特性

- ✨ 基于 Next.js 14 和 TypeScript
- 📦 使用 TanStack Table v8 (React Table) 进行表格管理
- 🎯 虚拟滚动支持，高效处理大量数据
- 🔄 无限滚动加载
- 🎨 使用 Tailwind CSS 和 shadcn/ui 组件
- 🔍 支持列排序和过滤
- ✏️ 批量编辑功能
- 🌙 支持暗色模式
- 🔐 集成 Supabase 认证和数据库

## 技术栈

- Next.js 14
- TypeScript
- TanStack Table (React Table)
- TanStack Virtual
- Tailwind CSS
- shadcn/ui
- Supabase

## 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd next-table
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 环境配置

创建 `.env.local` 文件并添加以下配置：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
  ├── app/                 # Next.js 应用目录
  ├── components/         # React 组件
  │   ├── data-table/    # 表格相关组件
  │   └── ui/            # UI 组件
  ├── lib/               # 工具函数和配置
  └── styles/            # 全局样式
```

## 主要功能

- **虚拟滚动**: 高效渲染大量数据，优化性能
- **无限加载**: 滚动到底部自动加载更多数据
- **列配置**: 支持固定列宽、自定义渲染
- **批量编辑**: 支持选择多行进行批量更新
- **响应式设计**: 适配不同屏幕尺寸
- **数据持久化**: 与 Supabase 数据库集成

## 开发指南

### 添加新列

在 `src/app/columns.tsx` 中定义新列：

```typescript
{
  accessorKey: "columnName",
  header: "列标题",
  cell: ({ row }) => (
    <div className="w-[width]px truncate">
      {row.getValue("columnName")}
    </div>
  ),
  size: width,
}
```

### 自定义样式

项目使用 Tailwind CSS 进行样式管理，可以在 `tailwind.config.ts` 中添加自定义配置。

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE) 