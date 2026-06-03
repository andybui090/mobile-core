import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import ChainedBackend from "i18next-chained-backend";
import Config from "react-native-config";

import en from "./locales/en";
import vi from "./locales/vi";
// import { STORAGEKEY } from "@/constants";
// import { storeStringData } from "@/storages";

const LANGUAGE_URL = `${Config.CDN_URL}/settings/languages/{{lng}}.json`;

const bundledResources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    initImmediate: true,
    fallbackLng: "en",
    debug: false,
    load: "all",
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      backends: [HttpBackend, resourcesToBackend(bundledResources)],
      backendOptions: [{ loadPath: LANGUAGE_URL }],
      reloadInterval:60000,
    },
    react: {
      useSuspense: false,
      nsMode: "fallback",
    },
  } as any);

i18n.on("languageChanged", async () => {
  // console.log("====== reload resource");
  // await storeStringData(STORAGEKEY.CHECK_GROUP_PRIVATE, 'false')
  await i18n.reloadResources();
});

export default i18n;