import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import App from '@/App.vue'
import Home from './Home.vue'

function renderHome() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(Home, {
    global: {
      plugins: [i18n],
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
        ParticleCanvas: true,
      },
    },
  })
}

describe('Home', () => {
  it('presents the product and a standalone duck mascot', () => {
    const wrapper = renderHome()
    expect(wrapper.get('h1').text()).toContain('让每一种灵感')
    expect(wrapper.get('[data-testid="hero-mascot"]').attributes('src')).toBe('/meristemforge-duck.png')
    expect(wrapper.get('[data-testid="hero-download"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('a[href="#capabilities"]').text()).toBe('查看创作能力')
  })

  it('renders four ordered playing-card creative modules', () => {
    const wrapper = renderHome()
    const cards = wrapper.findAll('[data-testid="capability-card"]')
    expect(cards).toHaveLength(4)
    expect(cards.map((card) => card.attributes('data-capability'))).toEqual([
      'video',
      'image',
      'music',
      'voice',
    ])
    expect(cards.map((card) => card.get('.capability-card__number').text())).toEqual([
      '01',
      '02',
      '03',
      '04',
    ])
    expect(cards[3].get('h3').text()).toBe('AI 配音与音色克隆')
  })

  it('provides an existing destination for the hero Explore link', () => {
    const wrapper = renderHome()
    const destination = wrapper.get('a[href="#capabilities"]').attributes('href') ?? ''
    expect(wrapper.find(destination).exists()).toBe(true)
  })

  it('explains the unified local workflow and keeps downloads unavailable', () => {
    const wrapper = renderHome()
    expect(wrapper.get('#workflow').text()).toContain('复杂能力，简单地放在一起')
    expect(wrapper.findAll('[data-testid="workflow-benefit"]')).toHaveLength(4)
    expect(wrapper.get('#release [data-testid="release-download"]').attributes('disabled')).toBeDefined()
  })

  it('renders a single-page shell with an about destination and product footer', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
    const wrapper = mount(App, { global: { plugins: [i18n] } })
    expect(wrapper.get('main #top').attributes('id')).toBe('top')
    expect(wrapper.get('#about').text()).toContain('创造，不止一种形状。')
    expect(wrapper.find('router-view').exists()).toBe(false)
  })
})
