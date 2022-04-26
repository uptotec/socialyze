import { StyleSheet, ImageBackground, FlatList } from 'react-native';
import { Text, View } from '../components/basic/Themed';
import { useQuery, useMutation } from 'react-query';
import {
  getRecommendationsApi,
  likeOrDislikeApi,
  getMatchesApi,
} from '../api/matching';
import { AxiosError } from 'axios';
import { useAuthStore } from '../store/auth.store';
import { IntrestResponseDto, UserResponseDto } from 'dto';

export default function HomeScreen() {
  const { data, isSuccess, isLoading } = useQuery('getMatches', getMatchesApi, {
    onError: (err: AxiosError) => console.log(err),
    refetchOnWindowFocus: true,
  });

  const user = useAuthStore((state) => state.user);

  const getCommon = (interests: IntrestResponseDto[]) => {
    if (!user) return;
    const intersection = interests.filter(
      (o1) => !user.interests.some((o2) => o1.id === o2.id),
    );
    return intersection.length;
  };

  const Card = (card: UserResponseDto) => (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: card.profilePhoto.url }}
        style={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          padding: 10,
        }}
      >
        <Text style={styles.text}>{`${card.fullName}, ${card.age}`}</Text>
        <View
          style={{
            alignSelf: 'center',
            padding: 5,
            borderRadius: 5,
            margin: 5,
          }}
        >
          <Text
            style={{ textAlign: 'center', marginHorizontal: 5 }}
          >{`${getCommon(card.interests)} matching intrests`}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSuccess && data.data.length !== 0 && (
        <FlatList
          data={data.data}
          renderItem={({ item }) => Card(item)}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card: {
    flex: 0.8,
    minHeight: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: '#222',
    textShadowOffset: { height: 3, width: 3 },
    textShadowRadius: 3,
    backgroundColor: 'transparent',
  },
});
