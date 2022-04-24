import { Button, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import { AuthCredentialsDto } from 'dto';
import { createValidator } from 'class-validator-formik';
import * as SecureStore from 'expo-secure-store';
import { useMutation } from 'react-query';

import { View, Text } from '../../components/basic/Themed';
import { loginApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth.store';

export default function SignInScreen() {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  const setTokens = useAuthStore((state) => state.setTokens);

  const { isError, mutate, isLoading } = useMutation(loginApi, {
    onSuccess: async (res) => {
      const { accessToken, refreshToken, isEmailConfirmed, iscompleteProfile } =
        res.data;
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      setTokens(accessToken, refreshToken);
      setIsSignedIn(true, isEmailConfirmed, iscompleteProfile);
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: { email: '', password: '' },
      onSubmit: (values) => mutate(values),
      validate: createValidator(AuthCredentialsDto),
    });

  return (
    <View style={styles.container}>
      <Text>SignIn Screen</Text>
      <View>
        <TextInput
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          value={values.email}
          style={styles.input}
          placeholder="email"
          keyboardType="email-address"
        />
        {touched.email && errors.email && <Text>{errors.email}</Text>}
        <View style={styles.separator} />
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
          title="login"
          disabled={isLoading}
        />
        {isLoading && <ActivityIndicator size="small" animating={isLoading} />}
        {isError && <Text>Login not valid</Text>}
      </View>
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
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  input: {
    width: 250,
    height: 30,
  },
});
