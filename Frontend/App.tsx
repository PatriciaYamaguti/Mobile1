import './global.css';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import Home from './src/Pages/Home';
import History from './src/Pages/History';
import SignIn from './src/Pages/SignIn';
import SignUp from './src/Pages/SignUp';
import { useAuthStore } from './src/store/authStore';
import { usePasswordStore } from './src/store/passwordStore';

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  SignIn: { email?: string } | undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const token = useAuthStore((state) => state.token);
  const loadingAuth = useAuthStore((state) => state.loadingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setOnline = usePasswordStore((state) => state.setOnline);
  const syncPending = usePasswordStore((state) => state.syncPending);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((netState) => {
      const connected = Boolean(netState.isConnected && netState.isInternetReachable !== false);
      setOnline(connected);
      if (connected) {
        syncPending(token);
      }
    });

    NetInfo.fetch().then((netState) => {
      const connected = Boolean(netState.isConnected && netState.isInternetReachable !== false);
      setOnline(connected);
      if (connected) {
        syncPending(token);
      }
    });

    return unsubscribe;
  }, [setOnline, syncPending, token]);

  if (loadingAuth) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      {isAuthenticated ? (
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
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
