import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { refreshToken } from './api';
import { useAuthStore } from './store/auth.store';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  const [appIsReady, setAppIsReady] = useState(false);

  const setTokens = useAuthStore((state) => state.setTokens);
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);

  const refreshAccessToken = async () => {
    const token = await SecureStore.getItemAsync('refreshToken');
    if (!token) return;
    const res = await refreshToken();
    if (res.status >= 300) return;

    const {
      isEmailConfirmed,
      iscompleteProfile,
      refreshToken: rToken,
      accessToken,
    } = res.data;
    await SecureStore.setItemAsync('refreshToken', rToken);
    setTokens(accessToken, rToken);
    setIsSignedIn(true, isEmailConfirmed, iscompleteProfile);
  };

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={() => refreshAccessToken()}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </QueryClientProvider>
    );
  }
}
