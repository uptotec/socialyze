import { Button, TextInput, StyleSheet, Image } from 'react-native';
import { useFormik } from 'formik';
import { FacultyResponseDto, signUpStep2DtoScreen1 } from 'dto';
import { createValidator } from 'class-validator-formik';
import { useQuery } from 'react-query';
import * as React from 'react';
import RNdateTimePicker from '@react-native-community/datetimepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { AxiosError } from 'axios';
import { useDebounce } from 'use-debounce';

import { View, Text } from '../../components/basic/Themed';
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
    <View style={styles.container}>
      <Text>SignupStep2 Screen</Text>
      {values.photo && (
        <Image
          source={{ uri: values.photo.uri }}
          style={{ width: 150, height: 150 }}
        />
      )}
      <Button title="Pick Profile Photo" onPress={pickImage} />
      <View>
        <TextInput
          onChangeText={handleChange('bio')}
          onBlur={handleBlur('bio')}
          value={values.bio}
          style={{ ...styles.input, height: 50 }}
          placeholder="Bio"
          multiline={true}
          maxLength={280}
          returnKeyType="done"
          blurOnSubmit={true}
          enablesReturnKeyAutomatically={true}
        />
        {touched.bio && errors.bio && <Text>{errors.bio}</Text>}
        <View style={styles.dateView}>
          <Text>Birthday: </Text>
          <RNdateTimePicker
            style={{ width: 100 }}
            value={values.birthDay ? new Date(values.birthDay) : new Date()}
            onChange={(_e: any, date: Date | undefined) =>
              setFieldValue('birthDay', date?.toISOString())
            }
            mode="date"
          />
        </View>

        <SearchableDropdown
          onItemSelect={(item) => {
            setFieldValue('faculty', item.id);
            setFieldValue('facultyName', item.name);
          }}
          containerStyle={{ maxWidth: 500, marginVertical: 10 }}
          onTextChange={(text) => setFieldValue('facultyName', text)}
          items={facilities}
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
