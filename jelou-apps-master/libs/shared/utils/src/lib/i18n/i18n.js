import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { App_en } from "./translations/en";
import { App_es } from "./translations/es";
import { App_pt } from "./translations/pt";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: App_en,
        },
        es: {
            translation: App_es,
        },
        pt: {
            translation: App_pt,
        },
    },
    lng: `${localStorage.getItem("lang") || "es"}`,
    fallbackLng: "es",
});

export default i18n;
