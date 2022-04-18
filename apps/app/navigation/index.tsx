import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import { useAuthStore } from '../store/auth.store';
import RootNavigator from './rootNavigation';
import AuthNavigator from './authNavigation';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {isSignedIn ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
