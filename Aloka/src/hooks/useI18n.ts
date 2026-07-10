import { useCallback, useEffect, useState } from "react";
import i18n from "@/i18n";
import { getObjectData, getStringData, storeObjectData, storeStringData } from "@/storages";
import { getLocales } from "react-native-localize";
import Config from 'react-native-config';
import ApiService from "@/services/api-base";
import ApiSSO from "@/services/api-sso";
import { STORAGEKEY } from "@/constants";
import { updateCategoriesWhenChangeLanguage } from "@/redux/slices/globalSlice";
import { store } from "@/redux/store";
import APIECommerceService from "@/services/api-ecommerce";

const LANGUAGES = "languages";

const useI18n = () => {
  const [lang, setLang] = useState<"vi" | "en" | any>();

  const _getSystemLanguage = useCallback((supportLangs: any[]) => {
    const language = supportLangs?.find((item: any) =>
      getLocales()[0].languageCode.includes(item?.lang)
    );
    return language?.lang ?? "en";
  }, []);

  const _detectLang = useCallback(async () => {
    const _localLang = await getStringData("@lang");
    // console.log("🚀 ~ const_detectLang=useCallback ~ _localLang:", _localLang)
    if (_localLang) {
      setLang(_localLang);
      ApiService.setXAppLanguage(lang);
      ApiSSO.setXAppLanguage(lang);
      APIECommerceService.setXAppLanguage(lang);
      return;
    }

    const response = await fetch(`${Config.BASE_API_URL}/${LANGUAGES}`);

    const json = await response.json();
    const _supportLangs = json?.items ?? [];

    const _deviceLang = _getSystemLanguage(_supportLangs);
    setLang(_deviceLang);
  }, [setLang, _getSystemLanguage]);

  useEffect(() => {
    _detectLang();
  }, []);

  useEffect(() => {
    const updateLang = async () => {
      if (lang) {
        await i18n.reloadResources();
        i18n.changeLanguage(lang);
        storeStringData("@lang", lang);
        ApiService.setXAppLanguage(lang);
        ApiSSO.setXAppLanguage(lang);
        APIECommerceService.setXAppLanguage(lang);
        const arrCategory = await getObjectData(STORAGEKEY.CATEGORIES_CHOOSE);
        if (arrCategory && arrCategory.categoryStore?.length > 0) {
          let oldARR = arrCategory.categoryStore;
          //goi API lay lai danh sach categories
          ApiService.getCategories({}).then(async (result: any) => {
            let newArr = [];
            if (result.status == 200 || result.status == 201) {
              const listData = result.data?.items || [];
              for (let i = 0; i < listData.length; i++) {
                let arrChild = listData[i].children || [];
                for (let j = 0; j < arrChild.length; j++) {
                  for (let k = 0; k < oldARR?.length; k++) {
                    if (oldARR[k].parent_id == arrChild[j].parent_id && oldARR[k].id == arrChild[j].id) {
                      newArr.push(arrChild[j]);
                      break;
                    }
                  }
                }
              }
            }
            let obj: any = {
              categoryStore: newArr,
            };
            await storeObjectData(STORAGEKEY.CATEGORIES_CHOOSE, obj);
            store.dispatch(updateCategoriesWhenChangeLanguage(null));
          });
        }
      }
    }
    updateLang();
  }, [lang]);

  return {
    setLang,
    i18n,
    lang,
  };
};

export default useI18n;
