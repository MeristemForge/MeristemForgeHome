import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as downloadApi from '@/api/download'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import App from '@/App.vue'
import Home from './Home.vue'

function renderHome() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(Home, { global: { plugins: [i18n] } })
}

describe('Home', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('presents the product and mascot', () => {
    const wrapper = renderHome()
    expect(wrapper.get('h1').text()).toContain('让每一种灵感')
    expect(wrapper.get('[data-testid="hero-mascot"]').attributes('src')).toBe('/meristemforge-duck.png')
    expect(wrapper.get('[data-testid="hero-download"]')).toBeTruthy()
  })

  it('renders four creative modules', () => {
    const wrapper = renderHome()
    expect(wrapper.findAll('[data-testid="capability-card"]')).toHaveLength(4)
    expect(wrapper.findAll('.capability-card__icon')).toHaveLength(4)
    expect(wrapper.get('.capability-scroll-hint').text()).toContain('横向滚动')
  })

  it('keeps workflow and release sections', () => {
    const wrapper = renderHome()
    expect(wrapper.get('#workflow').text()).toContain('四个工作台分别管理自己的本地项目')
    expect(wrapper.get('#workflow').text()).toContain('新建项目 → 查看教程')
    expect(wrapper.get('#release')).toBeTruthy()
  })

  it('checks the installer once and renders one hero download control', async () => {
    const checkInstallerSpy = vi
      .spyOn(downloadApi, 'checkInstallerAvailability')
      .mockResolvedValue(true)

    const wrapper = renderHome()
    await flushPromises()

    expect(checkInstallerSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('[data-testid="hero-download"]')).toHaveLength(1)
    expect(wrapper.get('a[data-testid="hero-download"]').attributes('href'))
      .toBe('/downloads/MeristemForge-Setup.exe')
    expect(wrapper.find('#release [data-testid="hero-download"]').exists()).toBe(false)
  })

  it('renders a single page shell', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
    const wrapper = mount(App, { global: { plugins: [i18n] } })
    expect(wrapper.get('main #top').attributes('id')).toBe('top')
  })
})
