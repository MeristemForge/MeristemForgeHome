import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import App from '@/App.vue'
import Home from './Home.vue'

function renderHome() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(Home, { global: { plugins: [i18n] } })
}

describe('Home', () => {
  it('presents the product and mascot', () => {
    const wrapper = renderHome()
    expect(wrapper.get('h1').text()).toContain('让每一种灵感')
    expect(wrapper.get('[data-testid="hero-mascot"]').attributes('src')).toBe('/meristemforge-duck.png')
    expect(wrapper.get('[data-testid="hero-download"]')).toBeTruthy()
  })

  it('renders four creative modules', () => {
    const wrapper = renderHome()
    expect(wrapper.findAll('[data-testid="capability-card"]')).toHaveLength(4)
  })

  it('keeps workflow and release sections', () => {
    const wrapper = renderHome()
    expect(wrapper.get('#workflow').text()).toContain('复杂能力，简单地放在一起')
    expect(wrapper.get('#release [data-testid="release-download"]')).toBeTruthy()
  })

  it('renders a single page shell', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
    const wrapper = mount(App, { global: { plugins: [i18n] } })
    expect(wrapper.get('main #top').attributes('id')).toBe('top')
  })
})
