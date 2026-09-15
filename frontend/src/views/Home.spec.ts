import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
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
})
