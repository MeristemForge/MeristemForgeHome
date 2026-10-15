export type CapabilityKey = 'video' | 'image' | 'music' | 'voice'
export type VideoTechniqueKey = 'pose' | 'depth' | 'time' | 'face' | 'continuation' | 'repair'

export interface CapabilityMessage {
  label: string
  description: string
}

export interface GuideStep {
  title: string
  detail: string
  action: string
}

export interface CreationGuide {
  title: string
  intro: string
  modes: string
  steps: [GuideStep, GuideStep, GuideStep, GuideStep]
  tip: string
}

export interface GuideMessages {
  eyebrow: string
  title: string
  subtitle: string
  tabsLabel: string
  diagram: string
  stepLabel: string
  previous: string
  next: string
  tipLabel: string
  learn: string
  items: Record<CapabilityKey, CreationGuide>
  videoTechniques: {
    title: string
    subtitle: string
    entryLabel: string
    items: Record<VideoTechniqueKey, VideoTechnique>
  }
}

export interface VideoTechnique {
  title: string
  summary: string
  entry: string
  steps: [string, string, string]
}

export interface MessageSchema {
  meta: {
    title: string
  }
  nav: {
    capabilities: string
    workflow: string
    guide: string
    release: string
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
    availability: string
  }
  capabilities: {
    eyebrow: string
    title: string
    subtitle: string
    scrollHint: string
    items: Record<CapabilityKey, CapabilityMessage>
  }
  workflow: {
    eyebrow: string
    title: string
    description: string
    benefits: [string, string, string, string]
    preparation: string
    steps: [GuideStep, GuideStep, GuideStep]
  }
  guide: GuideMessages
  release: {
    eyebrow: string
    title: string
    description: string
    pendingDescription: string
    publishedDescription: string
    backToDownload: string
    platform: string
    download: string
    checking: string
    pendingCta: string
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
