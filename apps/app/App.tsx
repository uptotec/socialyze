import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppLoading from 'expo-app-loading';
import { useState } from 'react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { refreshAccessToken } from './api';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  const [appIsReady, setAppIsReady] = useState(false);

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
