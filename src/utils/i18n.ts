// src/localization/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from '@APM/localization/en/translation.json';
import translationZHCN from '@APM/localization/zhcn/translation.json';

export const resources = {
  'zh_CN_#Hans': {
    translation: translationZHCN,
  },
  en: {
    translation: translationEN,
  },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  lng: 'zh_CN_#Hans',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
