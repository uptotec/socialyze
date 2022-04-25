import { Button, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import { ConfirmMailDto } from 'dto';
import { createValidator } from 'class-validator-formik';
import { useMutation } from 'react-query';

import { View, Text } from '../../components/basic/Themed';
import { confirmMailApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth.store';

export default function SignInScreen() {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);

  const { isError, mutate, isLoading } = useMutation(confirmMailApi, {
    onError: (err) => console.log(err),
    onSuccess: async () => {
      setIsSignedIn(true, true, false);
    },
  });

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: { code: '' },
      onSubmit: (values) => mutate(values),
      validate: createValidator(ConfirmMailDto),
    });

  return (
    <View style={styles.container}>
      <Text>ConfirmMail Screen</Text>
      <View>
        <TextInput
          onChangeText={handleChange('code')}
          onBlur={handleBlur('code')}
          value={values.code}
          style={styles.input}
          placeholder="confirmation Code"
          keyboardType="numeric"
        />
        {touched.code && errors.code && <Text>{errors.code}</Text>}
        <Button
          onPress={() => handleSubmit()}
          title="confirm"
          disabled={isLoading}
        />
        {isLoading && <ActivityIndicator size="small" animating={isLoading} />}
        {isError && <Text>code not valid</Text>}
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
