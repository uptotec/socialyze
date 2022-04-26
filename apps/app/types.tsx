/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signUpStep2DtoScreen1 } from 'dto';

declare global {
  namespace ReactNavigation {
    interface AuthParamList extends AuthStackParamList {}
  }
}

export type AuthStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Signin: undefined;
  ConfirmMail: undefined;
  Signup1: undefined;
  Signup2: undefined;
  Intrests: signUpStep2DtoScreen1;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  Matches: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<AuthStackParamList>
  >;
