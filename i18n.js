import i18n from 'i18next';
import 'intl';
import 'intl/locale-data/jsonp/en'; // Import locale data for English
import 'intl/locale-data/jsonp/he'; // Import locale data for Hebrew
import 'intl/locale-data/jsonp/pt'; // Import locale data for Hebrew
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import he from './locales/he.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  he: { translation: he },
  pt: { translation: pt },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', 
    resources,
    lng: RNLocalize.getLocales()[0].languageCode,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
