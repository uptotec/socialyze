import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/auth/signIn';
import { useAuthStore } from '../store/auth.store';
import BottomTabNavigator from './tabNavigation';
import SignUpStep2Screen from '../screens/auth/signupStep2';
import SignUpStep1Screen from '../screens/auth/signupStep1';
import { AuthStackParamList } from '../types';
import ConfirmMailScreen from '../screens/auth/confirmEmail';
import SelectIntrestsScreen from '../screens/auth/intrests';
import { Image } from 'react-native';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  const isEmailConfirmed = useAuthStore((state) => state.isEmailConfirmed);
  const isCompleteProfile = useAuthStore((state) => state.isCompleteProfile);
  console.log(isSignedIn, isEmailConfirmed, isCompleteProfile);

  if (isSignedIn && isEmailConfirmed && isCompleteProfile) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 160, height: 35 }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (isSignedIn && !isEmailConfirmed) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 160, height: 35 }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="ConfirmMail"
          component={ConfirmMailScreen}
          options={{ title: 'Confirm Your Email' }}
        />
      </Stack.Navigator>
    );
  }

  if (isSignedIn && isEmailConfirmed && !isCompleteProfile) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo.png')}
              style={{ width: 160, height: 35 }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="Signup2"
          component={SignUpStep2Screen}
          options={{ title: 'Complete Your Profile' }}
        />
        <Stack.Screen
          name="Intrests"
          component={SelectIntrestsScreen}
          options={{ title: 'Select Your Intrests' }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 160, height: 35 }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Signup1"
        component={SignUpStep1Screen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Signin" component={SignInScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
