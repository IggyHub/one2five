import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import TrelloLikeScreen from '../screens/TrelloLikeScreen';
const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="TrelloLikeScreen" component={TrelloLikeScreen} />
    </Stack.Navigator>
  );
}

export default AppStack;
