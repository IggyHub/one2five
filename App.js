import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppStack from './src/stacks/AppStack';
import * as RNLocalize from 'react-native-localize'; // Ensure this is imported
import i18n from './i18n';
import BottomTabNavigator from './src/stacks/BottomTabNavigator';
import CustomHeader from './src/screens/CustomHeader'; 
import LoadingScreen  from './src/screens/LoadingScreen'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { userStore } from './src/stores/UserStore';
const Stack = createStackNavigator();

// Create a Theme Context
const ThemeContext = createContext();

// A custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Example theme state
  const [theme, setTheme] = useState({
    colors: {
      background: '#fff',
      text: 'red',
      color:'red',
      // Define other theme properties here
    },
    // Include other theme settings like fonts, margins, etc.
  });

  // Function to toggle theme, for example
  const toggleTheme = () => {
    setTheme((currentTheme) => ({
      ...currentTheme,
      colors: {
        background: currentTheme.colors.background === '#fff' ? '#333' : '#fff',
        text: currentTheme.colors.text === '#333' ? 'red' : '#333',
      },
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'red', // Primary color for your app
      text: 'red', // General text color
      // Customize other colors as needed
    },
  };
  
  const loadLanguagePreference = async () => {
    try {
      const storedLanguage = await userStore.Language
      if (storedLanguage) {
        i18n.changeLanguage(storedLanguage);
        //console.log('loadLanguagePreference storedLanguage', storedLanguage);
      } else {
        const systemLanguage = RNLocalize.getLocales()[0].languageCode;
        //console.log('loadLanguagePreference systemLanguage', systemLanguage);
        i18n.changeLanguage(systemLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference', error);
    }
  };

  useEffect(() => {
    // Simulate an async initialization process
    async function initializeApp() {
      try {
        // Assuming initDB is an async function
        await userStore.initDB();
        await loadLanguagePreference();
        //console.log('initializeApp 3',userStore.isDarkModeEnabled);
        setIsInitialized(true);
      } catch (error) {
        console.log('initializeApp error',error);
        setLoadingMessage('Failed to load. Please try again.');
        // Handle initialization error (e.g., set error state, retry initialization)
      }
    }
    
    initializeApp();
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (!isInitialized) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer theme={{...MyTheme, ...MyTheme.colors}}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <CustomHeader />
          <BottomTabNavigator>
            <Stack.Screen name="AppStack" component={AppStack} />
          </BottomTabNavigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
