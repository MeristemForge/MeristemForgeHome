import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './en'
import zh from './zh'

const locale = localStorage.getItem('locale') === 'en' ? 'en' : 'zh'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'zh',
  messages: { en, zh },
})

function syncDocumentLocale(value: string) {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
  document.title = i18n.global.t('meta.title')
}

syncDocumentLocale(locale)
watch(i18n.global.locale, syncDocumentLocale)

export default i18n
