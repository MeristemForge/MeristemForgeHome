import type { MessageSchema } from './schema'

const en = {
  meta: { title: 'MeristemForge · All-in-One AI Creative Workspace' },
  nav: { capabilities: 'Creative Capabilities', workflow: 'How It Works', about: 'About', language: 'Switch to Chinese', ariaLabel: 'Primary navigation' },
  hero: {
    eyebrow: 'An All-in-One AI Creative Workspace',
    title: 'Give Every Idea a Shape of Its Own',
    subtitle: 'Create video, images, music, and voice in one local workspace. Manage models, assets, and projects together.',
    explore: 'Explore Capabilities',
    mascotAlt: 'MeristemForge white duck mascot',
  },
  capabilities: {
    eyebrow: 'Creative Capabilities',
    title: 'From Visuals to Sound, Let Ideas Grow',
    subtitle: 'Four ways to create, brought together in one workspace.',
    items: {
      video: { label: 'Video Creation', description: 'Create high-quality videos from prompts and references.' },
      image: { label: 'Image Creation', description: 'Generate and edit reusable visual assets.' },
      music: { label: 'Music Creation', description: 'Create complete soundtracks from ideas.' },
      voice: { label: 'AI Dubbing & Voice Cloning', description: 'Create expressive voices and reusable voice identities.' },
    },
  },
  workflow: {
    eyebrow: 'Create Locally. Stay in Control.',
    title: 'Complex Tools, Simply Brought Together',
    description: 'Projects, assets, and local models are connected in one creative workspace.',
    benefits: ['Local models and assets', 'Unified project management', 'Assets reused across modules', 'An interface made for creators'],
  },
  release: {
    eyebrow: 'MeristemForge for Windows',
    title: 'Download the Latest Version',
    description: 'The Windows installer is ready.',
    download: 'Download Windows',
    checking: 'Checking latest version...',
    status: { pending: 'Coming Soon', published: 'Published' },
    version: 'Version',
    note1: 'Create video, images, music, and voice',
    note2: 'Run locally with your files under your control',
    note3: 'Continuous improvements for creators',
  },
  footer: { tagline: 'Creativity Has More Than One Shape.', copyright: '© 2026 MeristemForge.' },
} satisfies MessageSchema

export default en
