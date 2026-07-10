import { useCallback, useEffect, useState } from 'react';
import i18n from '@/i18n';
import { getStringData, storeStringData } from '@/storages';
import { getLocales } from 'react-native-localize';
import Config from 'react-native-config';
import ApiService from '@/services/api-base';

const LANGUAGES = 'languages';

const useI18n = () => {
  const [lang, setLang] = useState<'vi' | 'en' | any>();

  const _getSystemLanguage = useCallback((supportLangs: any[]) => {
    const language = supportLangs?.find((item: any) =>
      getLocales()[0].languageCode.includes(item?.lang),
    );
    return language?.lang ?? 'en';
  }, []);

  const _detectLang = useCallback(async () => {
    const _localLang = getStringData('@lang');
    if (_localLang) {
      setLang(_localLang);
      ApiService.setXAppLanguage(lang);
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
        await i18n.changeLanguage(lang);
        storeStringData('@lang', lang);
        ApiService.setXAppLanguage(lang);
      }
    };
    updateLang();
  }, [lang]);

  return {
    setLang,
    i18n,
    lang,
  };
};

export default useI18n;
