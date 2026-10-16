# MeristemForge Website

[中文](README.zh.md)

MeristemForge is an all-in-one local AI creative workspace for video creation, image creation, music creation, and AI dubbing with voice cloning. This repository contains its official product website.

The website checks the Windows installer directly. No version number, release manifest, or manual publication status is required.

## Uploading and updating the installer

Rename the installer to `MeristemForge-Setup.exe` and place it directly in `frontend/public/`, with no subdirectory. Its fixed download URL is `/MeristemForge-Setup.exe`.

For later updates, replace that file and refresh the page. No frontend or JSON edits are needed. Missing files or failed requests show an unavailable status.

Builds automatically copy the installer to `frontend/dist/MeristemForge-Setup.exe` while preserving the source in `public`. Deploy `dist` to make it downloadable. Production installers can also be replaced directly in the website root independently of frontend builds. Deploy the updated frontend once to switch the download URL.

The static host must support `HEAD` and `GET` at that URL. Serve the actual file or a 404, and disable caching so replacement installers are not served from an old cache. For example, add this location to the existing Nginx site configuration:

```nginx
location = /MeristemForge-Setup.exe {
    try_files $uri =404;
    default_type application/octet-stream;
    add_header Cache-Control "no-store" always;
}
```

Upload under a temporary filename, then rename the completed upload to `MeristemForge-Setup.exe`.

## Local development

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```powershell
npm run test -- --run
npm run build
```

## Stack

- Vue 3
- TypeScript
- Vite
- Vue I18n

## License

[MIT](LICENSE)
