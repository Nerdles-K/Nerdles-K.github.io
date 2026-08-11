# 许子阳的个人主页

一个使用 React 和 Vite 构建的单页个人作品集，记录 AI、数据科学、模型评测与 Agent 系统相关经历。

## 本地运行

```bash
npm install
npm run dev
```

## 发布前需要补充

联系方式集中在 `src/personal-site.jsx` 的 `contactItems` 中。发布前请填写真实邮箱与 GitHub 地址：

```js
const contactItems = [
  {
    label: "Email",
    value: "name@example.com",
    href: "mailto:name@example.com",
  },
  {
    label: "GitHub",
    value: "github.com/username",
    href: "https://github.com/username",
  },
];
```

如有项目仓库、演示页面或实验报告，可以继续给 `projects` 中的项目添加链接。

## 检查命令

```bash
npm run lint
npm run build
```

## GitHub Pages 部署

仓库中的 `.github/workflows/deploy-pages.yml` 会在 `main` 分支更新后自动构建并发布网站。

- 用户主页仓库（例如 `Nerdles-K.github.io`）会使用根路径 `/`
- 普通项目仓库会自动使用 `/<仓库名>/`

在 GitHub 仓库的 **Settings → Pages** 中，将 **Source** 设为 **GitHub Actions** 即可。
