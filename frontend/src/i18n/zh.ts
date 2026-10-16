import type { MessageSchema } from './schema'
import { guideZh } from './guides'

const zh = {
  meta: { title: 'MeristemForge · 一体化 AI 创作工作台' },
  nav: {
    capabilities: '创作能力',
    workflow: '工作方式',
    guide: '使用教程',
    release: '下载',
    about: '关于',
    language: '切换到英文',
    ariaLabel: '主导航',
  },
  hero: {
    eyebrow: '一体化 AI 创作工作台',
    title: '让每一种灵感，都有创作的形状',
    subtitle: '视频、图片、音乐与声音，四个独立工作台集于一个桌面应用。按创作类型建立本地项目，管理各自的输入素材与生成结果。',
    explore: '跟着教程开始',
    availability: 'Windows x64 桌面版 · 视频 / 图片 / 音乐 / 声音四种创作',
    mascotAlt: 'MeristemForge 白色小鸭子吉祥物',
  },
  capabilities: {
    eyebrow: '创作能力',
    title: '从画面到声音，灵感自由延展',
    subtitle: '四个独立的创作模块，各自处理适合的视频、图片、音乐和声音流程。',
    scrollHint: '横向滚动，查看全部创作模块',
    items: {
      video: { label: '视频创作', description: '文生视频、图生视频与全能参考，支持片段续接和人脸修复。' },
      image: { label: '图片创作', description: '文本生图与图片编辑，支持原始图和参考图输入。' },
      music: { label: '音乐创作', description: '填写音乐描述与歌词，生成歌曲或纯音乐，保存项目内音乐风格。' },
      voice: { label: '声音创作', description: '导入人物音色，进行文转语音或音色转换，试听并保存结果。' },
    },
  },
  workflow: {
    eyebrow: '本地创作，始终可控',
    title: '四个工作台，各自专注一种创作',
    description: '四个工作台分别管理自己的本地项目、素材和生成结果。跨模块使用文件时，请先保存，再手动导入。',
    benefits: ['独立创作流程', '项目保存在本地', '项目内素材管理', '生成结果预览与下载'],
    preparation: '从安装到开始创作',
    steps: [
      { title: '安装桌面版', detail: '安装 Windows x64 版本，从桌面或开始菜单启动 MeristemForge。', action: 'Windows 安装包 → 打开' },
      { title: '选择创作模块', detail: '从软件首页进入视频、图片、音乐或声音工作台。', action: '软件首页 → 选择模块' },
      { title: '创建本地项目', detail: '点击“新建项目”并选择保存目录，然后从下方教程开始创作。', action: '新建项目 → 查看教程' },
    ],
  },
  guide: guideZh,
  release: {
    eyebrow: 'MeristemForge Windows 版',
    title: '下载 Windows 版',
    description: '下载适用于 Windows x64 的 MeristemForge 安装包。',
    pendingDescription: 'Windows 安装包暂不可用，请稍后再试。',
    publishedDescription: 'Windows 安装包已就绪，可在页面顶部直接下载。',
    backToDownload: '返回顶部查看下载',
    platform: 'Windows x64',
    download: '下载 Windows 版',
    checking: '正在检查安装包...',
    pendingCta: 'Windows 安装包暂不可用',
    status: { pending: '暂不可用', published: '可下载' },
    note1: '支持视频、图片、音乐和声音创作',
    note2: '本地运行，数据由用户掌控',
    note3: '持续优化创作体验',
  },
  footer: { tagline: '创造，不止一种形状。', copyright: '© 2026 MeristemForge.' },
} satisfies MessageSchema

export default zh
