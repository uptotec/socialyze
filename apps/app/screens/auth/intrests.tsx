import { Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import { signUpStep2Dto, FacultyResponseDto } from 'dto';
import { createValidator } from 'class-validator-formik';
import { useMutation, useQuery } from 'react-query';
import * as React from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { AxiosError } from 'axios';
import { useDebounce } from 'use-debounce';

import { View, Text } from '../../components/basic/Themed';
import constants from '../../constants/Layout';
import { signupStep2Api } from '../../api/auth';
import { useAuthStore } from '../../store/auth.store';
import { searchIntrestsApi } from '../../api';
import { AuthStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Intrests'>;

export default function SelectIntrestsScreen({ route }: Props) {
  const params = route.params;
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);

  const signupApi = useMutation(signupStep2Api, {
    onError: (err: AxiosError) => console.log(err.response?.data),
    onSuccess: async () => {
      setIsSignedIn(true, true, true);
    },
  });

  const { handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      ...params,
      intestName: '',
      interests: [] as string[],
    },
    onSubmit: (values) => signupApi.mutate(values),
    validate: createValidator(signUpStep2Dto),
  });

  const [intrests, setIntrests] = React.useState<FacultyResponseDto[]>([]);
  const [selectedIntrests, setSelectedIntrests] = React.useState<
    FacultyResponseDto[]
  >([]);
  const debouncedIntrests = useDebounce(values.intestName, 1000);

  useQuery(
    ['searchIntrests', debouncedIntrests],
    () => searchIntrestsApi(debouncedIntrests[0]),
    {
      onError: (err: AxiosError) => console.log(err),
      onSuccess: async (res) => {
        setIntrests(res.data);
      },
    },
  );

  return (
    <View style={styles.container}>
      <Text>SelectIntrests Screen</Text>
      <SearchableDropdown
        multi={true}
        chip={true}
        onItemSelect={(item) => {
          setFieldValue('interests', [...values.interests, item.id]);
          setSelectedIntrests([...selectedIntrests, item]);
        }}
        onRemoveItem={(item) => {
          const newValue = values.interests.filter(
            (sitem) => sitem !== item.id,
          );
          setFieldValue('interests', [...newValue]);
          const newlist = selectedIntrests.filter(
            (sitem) => sitem.id !== item.id,
          );
          setSelectedIntrests([...newlist]);
        }}
        selectedItems={selectedIntrests}
        containerStyle={{
          marginVertical: 10,
          width: constants.window.width * 0.8,
        }}
        onTextChange={(text) => setFieldValue('intestName', text)}
        items={intrests}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemsContainerStyle={{ maxHeight: 140 }}
        textInputProps={{
          placeholder: 'Intrests',
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <Button
        onPress={() => handleSubmit()}
        title="submit"
        disabled={signupApi.isLoading}
      />
      {signupApi.isLoading && (
        <ActivityIndicator size="small" animating={signupApi.isLoading} />
      )}
      {signupApi.isError && <Text>data not valid</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
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
