import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Home';
import History from './src/History';
import SignIn from './src/SignIn';
import SignUp from './src/SignUp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Signin' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Signup' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="History" component={History} options={{ title: 'Histórico de senhas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

