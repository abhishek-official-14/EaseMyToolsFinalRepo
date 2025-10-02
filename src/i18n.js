import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
// import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpBackend) // load translation files
    // .use(LanguageDetector) // detect user language
    .use(initReactI18next) // connect with React
    .init({
        fallbackLng: "en",
        debug: false, // make it true
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json" // path to JSONs
        },
        ns: ["header", "navbar","tools"],
        defaultNS: "header"
    });

export default i18n;
