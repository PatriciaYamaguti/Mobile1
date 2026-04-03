import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadAuthFromStorage() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('authUser'),
        ]);

        setToken(storedToken || null);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        setToken(null);
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }

    loadAuthFromStorage();
  }, []);

  const signIn = async (nextToken, nextUser) => {
    await AsyncStorage.setItem('authToken', nextToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['authToken', 'authUser']);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loadingAuth,
      signIn,
      signOut,
    }),
    [token, user, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
