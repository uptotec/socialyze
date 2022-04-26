import { StyleSheet, ImageBackground } from 'react-native';
import { Text, View } from '../components/basic/Themed';
import { useQuery, useMutation } from 'react-query';
import { getRecommendationsApi, likeOrDislikeApi } from '../api/matching';
import { AxiosError } from 'axios';
import Swiper from 'react-native-deck-swiper';
import { useAuthStore } from '../store/auth.store';
import { IntrestResponseDto } from 'dto';

export default function HomeScreen() {
  const { data, isSuccess, isLoading } = useQuery(
    'getRecommendations',
    getRecommendationsApi,
    {
      onError: (err: AxiosError) => console.log(err),
    },
  );

  const likeOrDislike = useMutation(likeOrDislikeApi, {
    onError: (err: AxiosError) => console.log(err.response?.data),
  });

  const user = useAuthStore((state) => state.user);

  const getCommon = (interests: IntrestResponseDto[]) => {
    if (!user) return;
    const intersection = interests.filter(
      (o1) => !user.interests.some((o2) => o1.id === o2.id),
    );
    return intersection.length;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Welcome back ${user?.fullName}`}</Text>
      {isSuccess && data.data.length !== 0 ? (
        <Swiper
          cards={data.data}
          renderCard={(card) => {
            return (
              <View style={styles.card}>
                <ImageBackground
                  source={{ uri: card.profilePhoto.url }}
                  style={{
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                    padding: 10,
                  }}
                >
                  <Text
                    style={styles.text}
                  >{`${card.fullName}, ${card.age}`}</Text>
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
          }}
          onSwipedLeft={(cardIndex) => {
            likeOrDislike.mutate({
              type: 'dislike',
              userId: data.data[cardIndex].id,
            });
          }}
          onSwipedRight={(cardIndex) => {
            likeOrDislike.mutate({
              type: 'like',
              userId: data.data[cardIndex].id,
            });
          }}
          onSwiped={(cardIndex) => {
            console.log(cardIndex);
          }}
          verticalSwipe={false}
          onSwipedAll={() => {
            console.log('onSwipedAll');
          }}
          cardIndex={0}
          backgroundColor={'transparent'}
          stackSize={3}
        />
      ) : (
        <Text style={styles.title}>No Avilable Matches</Text>
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
