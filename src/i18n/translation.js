import i18n from "@/i18n";
import { nextTick } from "vue";

const Translation = {
    get defaultLanguage() {
        return import.meta.env.VITE_DEFAULT_LANGUAGE;
    },

    get supportedLanguages() {
        return import.meta.env.VITE_SUPPORTED_LANGS.split(",");
    },

    isLanguageSupported(lang) {
        return Translation.supportedLanguages.includes(lang);
    },

    // change of site language
    set currentLanguage(lang) {
        i18n.global.locale.value = lang;
    },

    // get actual language
    get currentLanguage() {
        return i18n.global.locale.value;
    },

    // trigger of site language change
    async switchLanguage(lang) {
        await Translation.loadLang(lang);
        Translation.currentLanguage = lang;
        document.querySelector("html").setAttribute("lang", lang);
        localStorage.setItem("user-lang", lang);
    },

    // magic for lazy loading the translations
    async loadLang(lang) {
        if(!i18n.global.availableLocales.includes(lang)) {
            const messages = await import(`./lang/${lang}.json`);
            i18n.global.setLocaleMessage(lang, messages.default);
        }
        return nextTick();
    },

    get userLanguage() {
        const uLang = window.navigator.language || window.navigator.userLanguage || Translation.defaultLanguage;
        return uLang.split('-')[0];
    },

    get userPreferredLanguage() {
        const pLang = localStorage.getItem("user-lang");
        return Translation.isLanguageSupported(pLang) ? pLang : null;
    },

    guessTheLangauge() {
        // if the user had already choosen a language, use that
        if(Translation.userPreferredLanguage) {
            return Translation.userPreferredLanguage;
        }

        // otherwise use the browser language or the default one, if there is problem with obtaining it
        // but test it against the list of supported languages
        if(Translation.isLanguageSupported(Translation.userLanguage)){
            return Translation.userLanguage;
        }

        // in case the user did not choose a language,
        // and the browser language is not supported,
        // use the default language chosen by me
        return Translation.defaultLanguage;
    },

    async routerMiddleware(to, _from, next) {
        const paramLang = to.params.lang;

        // language in URL is not supported, 
        // let's guess the users real language
        if(!Translation.isLanguageSupported(paramLang)) {
            return next(Translation.guessTheLangauge())
        }

        // language in URL is supported, translate the site
        await Translation.switchLanguage(paramLang);
        return next();
    },

    routeGenerator(to) {
        return { ...to, params: { lang: Translation.currentLanguage, ...to.params } };
    }
}

export default Translation