# MeristemForge 官网

[English](README.md)

MeristemForge 是一体化本地 AI 创作工作台，覆盖视频创作、图片创作、音乐创作，以及 AI 配音与音色克隆。本仓库包含其官方产品网站。

网站直接检查 Windows 安装包是否可下载，不需要维护版本号、发布清单或发布状态。

## 上传与更新安装包

将安装包重命名为 `MeristemForge-Setup.exe`，直接放到 `frontend/public/` 目录，无需创建子目录。固定下载地址为 `/MeristemForge-Setup.exe`。

以后发布新版时，只需替换同名文件，刷新网页即可下载新版，无需修改网页或 JSON。安装包不存在或请求失败时，页面显示暂不可用。

构建时安装包会自动复制到 `frontend/dist/MeristemForge-Setup.exe`，`public` 中的源文件会保留。部署 `dist` 后即可下载。线上也可直接替换网站根目录的同名文件，独立于前端构建更新；首次切换下载地址需要部署新的前端构建。

静态服务器需支持该地址的 `HEAD` 和 `GET` 请求。该地址应返回真实文件或 404，并关闭缓存，避免覆盖同名文件后继续下载旧包。例如，在现有 Nginx 网站配置中加入：

```nginx
location = /MeristemForge-Setup.exe {
    try_files $uri =404;
    default_type application/octet-stream;
    add_header Cache-Control "no-store" always;
}
```

建议先以临时文件名上传，传完后再重命名为 `MeristemForge-Setup.exe`。

## 本地开发

```powershell
cd frontend
npm install
npm run dev
```

打开 http://localhost:3000。

## 验证

```powershell
npm run test -- --run
npm run build
```

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue I18n

## 许可证

[MIT](LICENSE)
