export type CapabilityKey = 'video' | 'image' | 'music' | 'voice'

export interface CapabilityMessage {
  label: string
  description: string
}

export interface MessageSchema {
  nav: {
    capabilities: string
    workflow: string
    about: string
    language: string
    ariaLabel: string
  }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    explore: string
    mascotAlt: string
  }
  capabilities: {
    eyebrow: string
    title: string
    subtitle: string
    items: Record<CapabilityKey, CapabilityMessage>
  }
  workflow: {
    eyebrow: string
    title: string
    description: string
    benefits: [string, string, string, string]
  }
  release: {
    eyebrow: string
    title: string
    description: string
    button: string
    download: string
    checking: string
    status: {
      pending: string
      published: string
    }
    version: string
    note1: string
    note2: string
    note3: string
  }
  footer: {
    tagline: string
    copyright: string
  }
}
