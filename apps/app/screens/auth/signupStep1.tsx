import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useFormik } from 'formik';
import { createValidator } from 'class-validator-formik';
import { SignUpStep1Dto } from 'dto';
import { useMutation } from 'react-query';
import * as SecureStore from 'expo-secure-store';

import { Text, View } from '../../components/basic/Themed';
import { AuthStackParamList } from '../../types';
import { useAuthStore } from '../../store/auth.store';
import { signupStep1Api } from '../../api';
import React from 'react';
import axios, { AxiosError } from 'axios';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup1'>;

export default function SignUpStep1Screen({ navigation }: Props) {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [errorMessage, setErrorMessage] = React.useState('');

  const { isError, mutate, isLoading, error } = useMutation(signupStep1Api, {
    onError: (err: AxiosError) => {
      if (axios.isAxiosError(err)) {
        setErrorMessage(err.response?.data.message);
      }
    },
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
    <View style={styles.container}>
      <Text>SignUp Screen</Text>
      <View>
        <TextInput
          onChangeText={handleChange('firstName')}
          onBlur={handleBlur('firstName')}
          value={values.firstName}
          style={styles.input}
          placeholder="First Name"
        />
        {touched.firstName && errors.firstName && (
          <Text>{errors.firstName}</Text>
        )}
        <TextInput
          onChangeText={handleChange('lastName')}
          onBlur={handleBlur('lastName')}
          value={values.lastName}
          style={styles.input}
          placeholder="Last Name"
        />
        {touched.lastName && errors.lastName && <Text>{errors.lastName}</Text>}
        <TextInput
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          value={values.email}
          style={styles.input}
          placeholder="email"
          keyboardType="email-address"
        />
        {touched.email && errors.email && <Text>{errors.email}</Text>}
        <TextInput
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
          style={styles.input}
          placeholder="password"
          secureTextEntry={true}
        />
        {touched.password && errors.password && <Text>{errors.password}</Text>}
        <Button
          onPress={() => handleSubmit()}
          title="sign up"
          disabled={isLoading}
        />
        {isLoading && <ActivityIndicator size="small" animating={isLoading} />}
        {isError && (
          <Text>
            {error ? (error.response ? error.response.data.message : '') : ''}
          </Text>
        )}
      </View>
      <View style={styles.separator}></View>
      <Text>Already have an account?</Text>
      <Button onPress={() => navigation.navigate('Signin')} title="log in" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
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
