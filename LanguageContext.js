import React, { createContext, useContext, useState, useEffect } from 'react';
import { userStore } from './src/stores/UserStore';
import * as RNLocalize from 'react-native-localize';
import { i18n } from './i18n'; 

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en'); // Default language

  const _setLanguage = async (newLanguage) => {
    setLanguageState(newLanguage); // Update state
    i18n.changeLanguage(newLanguage); 
  };

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const storedLanguage = userStore.Language;
        if (storedLanguage !== null) {
          _setLanguage(storedLanguage); // Set stored language
        } else {
          const systemLanguage = RNLocalize.getLocales()[0].languageCode;
          _setLanguage(systemLanguage); // Set system language
        }
      } catch (error) {
        console.error('Error loading language preference', error);
      }
    };

    loadLanguagePreference();
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: _setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
