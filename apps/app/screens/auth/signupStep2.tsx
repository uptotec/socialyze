import { Button as SystemButton, StyleSheet, Image } from 'react-native';
import { useFormik } from 'formik';
import { FacultyResponseDto, signUpStep2DtoScreen1 } from 'dto';
import { createValidator } from 'class-validator-formik';
import { useQuery } from 'react-query';
import * as React from 'react';
import RNdateTimePicker from '@react-native-community/datetimepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { AxiosError } from 'axios';
import { useDebounce } from 'use-debounce';

import {
  View,
  Text,
  Button,
  TextInput,
  HideKeyboard,
} from '../../components/basic/Themed';
import { searchFacultiesApi } from '../../api';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup2'>;

export default function SignUpStep2Screen({ navigation }: Props) {
  React.useEffect(() => {
    const getPermission = async () => {
      const picker = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!picker.granted) {
        alert('permisson denied!');
      }
    };
    getPermission();
  }, []);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: {
      bio: '',
      birthDay: '',
      faculty: '',
      facultyName: '',
      intestName: '',
      interests: [] as string[],
      photo: null as ImagePicker.ImageInfo | null,
    },
    onSubmit: (values) => navigation.navigate('Intrests', values),
    validate: createValidator(signUpStep2DtoScreen1),
  });

  const pickImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    console.log(results);
    if (!results.cancelled) {
      setFieldValue('photo', results);
    }
  };

  const [facilities, setFacilities] = React.useState<FacultyResponseDto[]>([]);
  const debouncedName = useDebounce(values.facultyName, 1000);

  useQuery(
    ['searchFaclities', debouncedName],
    () => searchFacultiesApi(debouncedName[0]),
    {
      onError: (err: AxiosError) => console.log(err),
      onSuccess: async (res) => {
        setFacilities(res.data);
      },
    },
  );

  return (
    <HideKeyboard>
      <View style={styles.container}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Image
          source={
            values.photo
              ? { uri: values.photo.uri }
              : require('../../assets/images/user.png')
          }
          style={{
            width: 80,
            height: 80,
            borderRadius: 150 / 2,
            overflow: 'hidden',
          }}
        />

        <SystemButton
          title="Pick Profile Photo"
          onPress={pickImage}
          color="#02e390"
        />
        <View>
          <TextInput
            title="bio"
            onChangeText={handleChange('bio')}
            onBlur={handleBlur('bio')}
            value={values.bio}
            style={{ height: 50 }}
            placeholder="Bio"
            multiline={true}
            maxLength={280}
            returnKeyType="done"
            blurOnSubmit={true}
            enablesReturnKeyAutomatically={true}
          />
          {touched.bio && errors.bio && <Text>{errors.bio}</Text>}
          <View style={styles.dateView}>
            <Text style={styles.small}>Birthday: </Text>
            <RNdateTimePicker
              style={{ width: 100 }}
              value={values.birthDay ? new Date(values.birthDay) : new Date()}
              onChange={(_e: any, date: Date | undefined) =>
                setFieldValue('birthDay', date?.toISOString())
              }
              mode="date"
            />
          </View>
          <Text style={styles.small}>faculty</Text>
          <SearchableDropdown
            onItemSelect={(item) => {
              setFieldValue('faculty', item.id);
              setFieldValue('facultyName', item.name);
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            containerStyle={{
              maxWidth: 500,
              marginVertical: 10,
            }}
            textInputStyle={{
              borderRadius: 15,
              borderWidth: 1,
              borderColor: '#d9d9d9',
              paddingVertical: 12,
              paddingHorizontal: 10,
            }}
            onTextChange={(text) => setFieldValue('facultyName', text)}
            items={facilities}
            itemsContainerStyle={{ maxHeight: 140 }}
            textInputProps={{
              placeholder: 'faculty',
              value: values.facultyName,
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />

          <Button onPress={() => handleSubmit()} title="Continue" />
        </View>
      </View>
    </HideKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 15,
  },
  dateView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
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
  small: {
    color: '#d9d9d9',
    marginLeft: 7,
    marginTop: 5,
  },
});
