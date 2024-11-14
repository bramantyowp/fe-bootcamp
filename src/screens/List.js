/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useEffect } from 'react';
import {
    FlatList,
    SafeAreaView,
    useColorScheme,
} from 'react-native';

import axios from 'axios';
import CarList from '../components/CarList';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import { useNavigation } from '@react-navigation/native';
const COLORS = {
    primary: '#A43333',
    secondary: '#5CB85F',
    darker: '#121212',
    lighter: '#ffffff'
}

function List() {
    const [cars, setCars] = useState([])
    const isDarkMode = useColorScheme() === 'dark';
    const navigation = useNavigation();
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await axios('https://ugly-baboon-brambt8ihpod-c5531254.koyeb.app/api/v1/cars')
                console.log(res.data)
                setCars(res.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchCars()
    }, [])

    const backgroundStyle = {
        // overflow: 'visible',
        backgroundColor: isDarkMode ? COLORS.darker : COLORS.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <FocusAwareStatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={COLORS.lighter}
            />
            {/* end banner */}
            <FlatList
                data={cars.data}
                renderItem={({ item, index }) =>
                    <CarList
                        key={item.id}
                        image={{ uri: item.img }}
                        carName={item.name}
                        passengers={5}
                        baggage={4}
                        price={item.price}
                        onPress={() => navigation.navigate('Detail', {id: item.id})}
                    />
                }
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

export default List;
