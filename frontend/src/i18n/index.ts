import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

const locale = localStorage.getItem('locale') === 'en' ? 'en' : 'zh'
document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh',
  messages: { en, zh },
})

export default i18n
