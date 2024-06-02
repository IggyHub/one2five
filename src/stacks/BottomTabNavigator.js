import ProfileScreen from '../screens/ProfileScreen';
import TrelloLikeScreen from '../screens/TrelloLikeScreen';
import CustomTabBar from './CustomTabBar';
import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function BottomTabNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      initialRouteName="Home"
      tabBarPosition="bottom" // Position the tab bar at the bottom
      screenOptions={{
        swipeEnabled: false, // Enable swiping between tabs
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        },
        indicatorStyle: {
          height: 0, // Hide the indicator
        },
        showIcon: true, // You can use icons in the tabs if you have them set up
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { height: 0 },
        tabBarIconStyle: { 
          height: 60, // Adjust the height of the tab bar
          paddingTop: 5, // Add padding at the top
          paddingBottom: 5, // Add padding at the bottom
         },
        tabBarLabelStyle: {
          fontSize: 12, // Smaller text size
          paddingBottom: 5, // Adjust padding to align text
        },
      }}
    >
      <Tab.Screen name={t("Poll_Selection")} component={TrelloLikeScreen}   
      options={{
        tabBarIconName: "key",
        }}
        />
      <Tab.Screen name={t('Profile')} component={ProfileScreen}   
      options={{
        tabBarIconName: "person",
        }}
        />

      
    </Tab.Navigator>
  );
}
//      <Tab.Screen name={t("RatingGraphScreen")} component={RatingGraphScreen}  initialParams={{ pollId: -1 }} />
//<Tab.Screen name={t("QuestionsScreen")} component={QuestionsScreen}  initialParams={{ category: false }}/>
export default BottomTabNavigator;
