import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/Pages/Home';
import History from './src/Pages/History';
import SignIn from './src/Pages/SignIn';
import SignUp from './src/Pages/SignUp';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { token, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {token ? (
        <>
          <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          <Stack.Screen name="History" component={History} options={{ title: 'Historico de senhas' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Signin' }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Signup' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
