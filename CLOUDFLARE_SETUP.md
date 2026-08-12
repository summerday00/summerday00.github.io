# Cloudflare Pages + Cloudflare Access 部署指南

本文档用于把当前 Hexo + NexT 博客迁移到 Cloudflare Pages，并用 Cloudflare Access 保护私密目录（`/private/`）。

## 一、把源码放进 Git（必须做）

博客源码目前没有纳入版本管理，Cloudflare Pages 需要连接一个 GitHub 仓库来构建。

1. 在 GitHub 上创建一个 **私有** 仓库（例如 `blog-source`）。必须私有：因为日记源码也会放在这个仓库里。
2. 处理 `themes/next` 目录：它本身是一个 NexT 主题的 Git 克隆，直接 `git add .` 会被 Git 当成子模块，导致主题文件推不上去、Cloudflare 构建失败。
   - 推荐做法：删除 `themes/next/.git`（只删这个隐藏目录，主题文件不受影响；NexT 是开源主题，随时可以从 GitHub 重新获取）。
   - 删除后执行：

```bash
git init
git add .
git commit -m "chore: init blog source"
git branch -M main
git remote add origin https://github.com/<你的用户名>/blog-source.git
git push -u origin main
```

> 注意：`.gitignore` 已包含 `node_modules/`、`public/`、`.deploy_git/`，这些不会提交。

## 二、创建 Cloudflare Pages 项目

1. 注册 / 登录 [Cloudflare](https://dash.cloudflare.com)（免费版即可）。
2. 左侧进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 授权 GitHub，选择第一步创建的私有源码仓库。
4. 项目设置：
   - Framework preset：`Hexo`
   - Build command：`npm run build`
   - Build output directory：`public`
   - 环境变量：`NODE_VERSION=20`
5. 点击 **Save and Deploy**，等待构建完成。
6. 部署成功后你会得到一个 `https://<项目名>.pages.dev` 域名，公共部分即可访问。

## 三、（可选）绑定自定义域名

如果想让访问更稳定或使用自己的域名：

1. 在 Cloudflare 添加你的域名（DNS 接入 Cloudflare）。
2. 在 Pages 项目 → **Custom domains** 里绑定该域名。
3. 把 `_config.yml` 中的 `url` 和 `source/robots.txt` 里的 `Sitemap` 地址改成新域名。
4. 重新 `git push` 触发构建。

## 四、用 Cloudflare Access 保护私密目录

这是实现“日记只有我能看”的关键步骤，未登录时内容根本不会下发。

1. 打开 [Cloudflare Zero Trust](https://one.dash.cloudflare.com) 面板。
2. 进入 **Access** → **Applications** → **Add an application** → **Self-hosted**。
3. Application domain 填写：
   - Domain：你的 Pages 域名（如 `your-project.pages.dev`）
   - Path：`/private/*`
4. 创建策略（Policy）：
   - Name：`my-private`
   - Action：`Allow`
   - Session duration：`1 month`（可自选）
   - Rule：`Include` → `Emails` → 填你自己的邮箱
5. 登录方式选择 **Email OTP**（邮箱验证码）。
6. 保存后，用无痕窗口访问 `https://你的域名/private/`：
   - 未登录 → 跳转到 Cloudflare 登录页
   - 输入你的邮箱收到验证码 → 通过后可以查看
   - 其他邮箱 → 被拒绝

> Cloudflare Access 免费版支持最多 50 个用户，个人使用完全够用。

## 五、私密内容怎么写

- 私密文章放在 `source/private/` 目录下，例如 `source/private/2026-08-13-diary.md`。
- **不要**把私密文章放进 `source/_posts/`，否则会出现在首页、归档、标签和搜索中。
- 私密页面 front-matter 建议加 `noindex: true` 和 `sitemap: false`（参考 `source/private/index.md`）。
- 构建后访问路径：`https://你的域名/private/2026-08-13-diary/`。

## 六、日常更新

```bash
hexo new page private/2026-08-13-diary   # 创建为页面，而不是文章
git add .
git commit -m "diary: ..."
git push
```

推送后 Cloudflare Pages 会自动构建部署。公共部分不受影响，只有 `/private/*` 需要登录。
