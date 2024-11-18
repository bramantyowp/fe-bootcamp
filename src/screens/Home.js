import { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux'; // Menggunakan Redux
import { getAllCars } from '../redux/reducers/cars'; // Import action getAllCars
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import CarList from '../components/CarList';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#A43333',
  secondary: '#5CB85F',
  darker: '#121212',
  lighter: '#ffffff',
};

const ButtonIcon = ({ icon, title }) => (
  <Button>
    <View style={styles.iconWrapper}>
      <Icon name={icon} size={25} color="#fff" />
    </View>
    <Text style={styles.iconText}>{title}</Text>
  </Button>
);

function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { cars, status, message } = useSelector((state) => state.cars); // Mengambil data dari Redux store
  const [user, setUser] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  // Mengambil data user dari AsyncStorage
  const getUser = async () => {
    try {
      const res = await AsyncStorage.getItem('user');
      setUser(JSON.parse(res));
      console.log(res);
    } catch (e) {
      console.log(e);
      setUser(null);
    }
  };

  // Mengambil data mobil hanya jika data belum ada di Redux
  useEffect(() => {
    if (!cars || cars.length === 0) {
      dispatch(getAllCars()); // Dispatch action untuk mengambil data mobil
    }
  }, [dispatch, cars]);

  // Menggunakan useFocusEffect untuk mengambil data user dan menjaga data
  useFocusEffect(
    useCallback(() => {
      getUser();
      return () => {
        setUser(null); // Clear user data when screen is unfocused
      };
    }, [])
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? COLORS.darker : COLORS.lighter,
  };

  // Jika status loading, tampilkan loading spinner
  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  // Jika status gagal, tampilkan pesan error
  if (status === 'failed') {
    return <Text>Error: {message}</Text>;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <FocusAwareStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.primary}
      />
      <FlatList
        data={cars} // Data diambil dari Redux store
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerContainer}>
                <View>
                  <Text style={styles.headerText}>Hi, {user ? user.fullname : 'Guest'}</Text>
                  <Text style={styles.headerTextLocation}>Your Location</Text>
                </View>
                <View>
                  <Image
                    style={styles.imageRounded}
                    source={{ uri: 'https://i.pravatar.cc/100' }}
                    width={50}
                    height={50}
                  />
                </View>
              </View>
              <View style={{ ...styles.headerContainer, ...styles.bannerContainer }}>
                <View style={styles.bannerDesc}>
                  <Text style={styles.bannerText}>Sewa Mobil Berkualitas di kawasanmu</Text>
                  <Button color={COLORS.secondary} title="Sewa Mobil" />
                </View>
                <View style={styles.bannerImage}>
                  <Image
                    source={require('../assets/images/img_car.png')}
                    width={50}
                    height={50}
                  />
                </View>
              </View>
            </View>
            <View style={styles.iconContainer}>
              <ButtonIcon icon="truck" title="Sewa Mobil" />
              <ButtonIcon icon="box" title="Oleh-Oleh" />
              <ButtonIcon icon="key" title="Penginapan" />
              <ButtonIcon icon="camera" title="Wisata" />
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <CarList
            key={item.id}
            image={{ uri: item.img }}
            carName={item.name}
            passengers={5}
            baggage={4}
            price={item.price}
            onPress={() => navigation.navigate('Detail', { id: item.id, data: item })}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    height: 130,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // posisi horizontal
    alignItems: 'center', // posisi
    padding: 10,
  },
  imageRounded: {
    borderRadius: 40,
  },
  headerText: {
    color: COLORS.lighter,
    fontWeight: 700,
    fontSize: 12,
  },
  headerTextLocation: {
    color: COLORS.lighter,
    fontWeight: 700,
    fontSize: 14,
  },
  bannerContainer: {
    borderRadius: 4,
    padding: 0,
    backgroundColor: '#AF392F',
    marginHorizontal: 10,
    flexWrap: 'wrap',
    marginBottom: -200,
  },
  bannerText: {
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.lighter,
  },
  bannerDesc: {
    paddingHorizontal: 10,
    width: '40%',
  },
  iconContainer: {
    marginTop: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  iconWrapper: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 15,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    minWidth: 65,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Home;
