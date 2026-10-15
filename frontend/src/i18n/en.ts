import type { MessageSchema } from './schema'
import { guideEn } from './guides'

const en = {
  meta: { title: 'MeristemForge · All-in-One AI Creative Workspace' },
  nav: { capabilities: 'Studios', workflow: 'Get Ready', guide: 'Learn', release: 'Release', about: 'About', language: 'Switch to Chinese', ariaLabel: 'Primary navigation' },
  hero: {
    eyebrow: 'An All-in-One AI Creative Workspace',
    title: 'Give Every Idea a Shape of Its Own',
    subtitle: 'Four independent studios for video, images, music and voice in one desktop app. Create local projects and manage inputs and outputs within each studio.',
    explore: 'Follow the Guides',
    availability: 'Windows desktop app · Four creative studios for video, images, music and voice',
    mascotAlt: 'MeristemForge white duck mascot',
  },
  capabilities: {
    eyebrow: 'Creative Capabilities',
    title: 'From Visuals to Sound, Let Ideas Grow',
    subtitle: 'Four dedicated studios, each with workflows for video, images, music or voice.',
    scrollHint: 'Scroll horizontally to view all studios',
    items: {
      video: { label: 'Video Studio', description: 'Text to video, image to video and omni-reference, with clip continuation and face refinement.' },
      image: { label: 'Image Studio', description: 'Generate from text or edit images using source and reference images.' },
      music: { label: 'Music Studio', description: 'Supply descriptions and lyrics for songs or instrumentals. Save musical styles within a project.' },
      voice: { label: 'Voice Studio', description: 'Import voice profiles for text to speech or voice conversion. Listen to and save the results.' },
    },
  },
  workflow: {
    eyebrow: 'Create Locally. Stay in Control.',
    title: 'Four Studios. Each with Its Own Workflow.',
    description: 'Each studio manages its own local projects, assets and generated results. Save and manually import files when moving them between studios.',
    benefits: ['Independent workflows', 'Locally saved projects', 'Assets within each project', 'Output preview and download'],
    preparation: 'From installation to your first project',
    steps: [
      { title: 'Install the desktop app', detail: 'Install the Windows x64 version, then open MeristemForge from the desktop or Start menu.', action: 'Windows installer → Open app' },
      { title: 'Choose a studio', detail: 'Open video, image, music or voice from the launcher.', action: 'Launcher → Choose a studio' },
      { title: 'Create a local project', detail: 'Choose New project and a save folder, then follow the guide below to get started.', action: 'New project → View guide' },
    ],
  },
  guide: guideEn,
  release: {
    eyebrow: 'MeristemForge for Windows',
    title: 'Windows Release Information',
    description: 'Check the public release status and release notes.',
    pendingDescription: 'The public installer has not been released yet. The Windows download will open at the top of this page when available.',
    publishedDescription: 'The public release is available. Download the Windows installer at the top of this page.',
    backToDownload: 'Back to the download at the top',
    platform: 'Windows x64',
    download: 'Download Windows',
    checking: 'Checking release status...',
    pendingCta: 'Windows installer coming soon',
    status: { pending: 'Coming Soon', published: 'Published' },
    version: 'Version',
    note1: 'Create video, images, music, and voice',
    note2: 'Run locally with your files under your control',
    note3: 'Continuous improvements for creators',
  },
  footer: { tagline: 'Creativity Has More Than One Shape.', copyright: '© 2026 MeristemForge.' },
} satisfies MessageSchema

export default en
