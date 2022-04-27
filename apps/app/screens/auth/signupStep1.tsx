import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import { createValidator } from 'class-validator-formik';
import { SignUpStep1Dto } from 'dto';
import { useMutation } from 'react-query';
import * as SecureStore from 'expo-secure-store';

import {
  Text,
  View,
  Button,
  TextInput,
  HideKeyboard,
} from '../../components/basic/Themed';
import { AuthStackParamList } from '../../types';
import { useAuthStore } from '../../store/auth.store';
import { signupStep1Api } from '../../api';
import React from 'react';
import { AxiosError } from 'axios';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup1'>;

export default function SignUpStep1Screen({ navigation }: Props) {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const setTokens = useAuthStore((state) => state.setTokens);

  const { isError, mutate, isLoading, error } = useMutation(signupStep1Api, {
    onError: (err: AxiosError) => console.log(err),
    onSuccess: async (res) => {
      const {
        accessToken,
        refreshToken,
        isEmailConfirmed,
        iscompleteProfile,
        expAccessToken,
      } = res.data;
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      setTokens(accessToken, expAccessToken, refreshToken);
      setIsSignedIn(true, isEmailConfirmed, iscompleteProfile);
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: { firstName: '', lastName: '', email: '', password: '' },
      onSubmit: (values) => mutate(values),
      validate: createValidator(SignUpStep1Dto),
    });
  return (
    <HideKeyboard>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Socialyze</Text>
        <View>
          <TextInput
            title="first Name"
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}
            placeholder="First Name"
          />
          {touched.firstName && errors.firstName && (
            <Text>{errors.firstName}</Text>
          )}
          <TextInput
            title="last Name"
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}
            placeholder="Last Name"
          />
          {touched.lastName && errors.lastName && (
            <Text>{errors.lastName}</Text>
          )}
          <TextInput
            title="email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            placeholder="email"
            keyboardType="email-address"
          />
          {touched.email && errors.email && <Text>{errors.email}</Text>}
          <TextInput
            title="password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            placeholder="password"
            secureTextEntry={true}
          />
          {touched.password && errors.password && (
            <Text>{errors.password}</Text>
          )}
          <Button
            onPress={() => handleSubmit()}
            title="sign up"
            disabled={isLoading}
          />
          {isLoading && (
            <ActivityIndicator size="small" animating={isLoading} />
          )}
          {isError && (
            <Text>
              {error ? (error.response ? error.response.data.message : '') : ''}
            </Text>
          )}
          <View style={styles.separator}></View>
          <Text style={{ textAlign: 'center' }}>Already have an account?</Text>
          <Button
            onPress={() => navigation.navigate('Signin')}
            title="log in"
          />
        </View>
      </View>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    width: 250,
    height: 40,
    margin: 5,
  },
});
