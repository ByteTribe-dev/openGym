import { useSyncExternalStore } from 'react'

export const LANGS = {
  en: 'English', de: 'Deutsch', es: 'Español', fr: 'Français', it: 'Italiano',
  pt: 'Português', pl: 'Polski', tr: 'Türkçe', ru: 'Русский', zh: '中文',
  ko: '한국어', hi: 'हिन्दी',
}

export const INSTR_LANGS = ['en', 'es', 'fr', 'it', 'tr', 'ru', 'zh', 'hi', 'pl', 'ko']

const DATE_LOCALES = {
  en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', pt: 'pt-PT',
  pl: 'pl-PL', tr: 'tr-TR', ru: 'ru-RU', zh: 'zh-CN', ko: 'ko-KR', hi: 'hi-IN',
}

const localeLoaders = {
  de: () => import('./locales/de.js'), es: () => import('./locales/es.js'),
  fr: () => import('./locales/fr.js'), hi: () => import('./locales/hi.js'),
  it: () => import('./locales/it.js'), ko: () => import('./locales/ko.js'),
  pl: () => import('./locales/pl.js'), pt: () => import('./locales/pt.js'),
  ru: () => import('./locales/ru.js'), tr: () => import('./locales/tr.js'),
  zh: () => import('./locales/zh.js'),
}

const instructionLoaders = {
  es: () => import('./instructions/es.js'), fr: () => import('./instructions/fr.js'),
  hi: () => import('./instructions/hi.js'), it: () => import('./instructions/it.js'),
  ko: () => import('./instructions/ko.js'), pl: () => import('./instructions/pl.js'),
  ru: () => import('./instructions/ru.js'), tr: () => import('./instructions/tr.js'),
  zh: () => import('./instructions/zh.js'),
}

let lang = 'en'
let dict = {}
let instructions = null
let version = 0
const subscribers = new Set()

const notify = () => {
  version += 1
  subscribers.forEach(listener => listener())
}

export const getLang = () => lang
export const dateLocale = () => DATE_LOCALES[lang] || DATE_LOCALES.en

export function t(source, ...args) {
  let value = dict[source] || source
  args.forEach((arg, index) => {
    value = value.replaceAll(`{${index}}`, String(arg))
  })
  return value
}

export const instrFor = exercise => instructions?.[exercise.id] || exercise.st || []

export async function setLang(nextLanguage) {
  const next = LANGS[nextLanguage] ? nextLanguage : 'en'
  if (next === lang && version > 0) return
  lang = next
  try {
    dict = next === 'en' ? {} : (await localeLoaders[next]()).default
    instructions = next === 'en' || !instructionLoaders[next]
      ? null
      : (await instructionLoaders[next]()).default
  } catch {
    dict = {}
    instructions = null
  }
  notify()
}

export function useLang() {
  return useSyncExternalStore(
    listener => {
      subscribers.add(listener)
      return () => subscribers.delete(listener)
    },
    () => version,
  )
}
