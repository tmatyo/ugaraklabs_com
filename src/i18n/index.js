import { createI18n } from "vue-i18n";
import en from "./lang/en.json"

export default createI18n({
    locale: import.meta.env.VITE_DEFAULT_LANG,
    fallbackLocale: import.meta.env.VITE_FALLBACK_LANG,
    legacy: false,
    globalInjection: true,
    //warnHtmlMessage: false,
    //warnHtmlInMessage: 'off',
    messages: { en }
})