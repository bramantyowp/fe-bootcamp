import { useState, useEffect } from 'react';
import {
    FlatList,
    SafeAreaView,
    useColorScheme,
    Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import dari Redux
import { getAllCars } from '../redux/reducers/cars'; // Import action getAllCars
import CarList from '../components/CarList';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
    primary: '#A43333',
    secondary: '#5CB85F',
    darker: '#121212',
    lighter: '#ffffff',
};

function List() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { cars, status, message } = useSelector((state) => state.cars); // Ambil data dari Redux
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        dispatch(getAllCars()); // Dispatch untuk ambil data mobil dari Redux
    }, [dispatch]);

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
                backgroundColor={COLORS.lighter}
            />
            <FlatList
                data={cars} // Gunakan data dari Redux
                renderItem={({ item }) => (
                    <CarList
                        key={item.id}
                        image={{ uri: item.img }}
                        carName={item.name}
                        passengers={item.seat}
                        baggage={item.baggage}
                        price={item.price}
                        onPress={() =>
                            navigation.navigate('Detail', {
                                id: item.id, // Kirim id
                                data: item,   // Kirim seluruh data item mobil
                            })
                        }
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
}

export default List;
