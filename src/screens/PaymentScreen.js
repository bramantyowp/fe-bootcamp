import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../redux/reducers/cars/api'; // Ensure path is correct

const PaymentScreen = ({ id }) => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.cars); // Access state from Redux
  console.log('Fetched data from Redux:', data); // Debugging: log the fetched data

  const [selectedBank, setSelectedBank] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [originalAmount, setOriginalAmount] = useState(0);

  useEffect(() => {
    // Jika data belum ada, fetch data dari API
    if (!data && id) {
      console.log('Fetching data...');
      dispatch(getData()).then(() => {
        console.log('Data fetched from Redux:', data);
      });
    }
  }, [dispatch, data, id]);  
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Find the car by id and set the amounts
      const carData = data.find((car) => car.id === id);
      if (carData) {
        setOriginalAmount(carData.price);
        setTotalAmount(carData.price);
      } else {
        Alert.alert('Data mobil tidak ditemukan');
      }
    }
  }, [data, id]);

  const applyPromo = () => {
    let discount = 0;

    if (promoCode === 'DISKON50') {
      discount = 50000;
      Alert.alert('Kode promo diterapkan!');
    } else if (promoCode === 'DISKON20') {
      discount = 23000;
      Alert.alert('Kode promo DISKON20 diterapkan!');
    } else {
      Alert.alert('Kode promo tidak valid!');
    }

    setTotalAmount(originalAmount - discount);
  };

  const makePayment = () => {
    if (!selectedBank) {
      Alert.alert('Silakan pilih metode transfer');
      return;
    }

    Alert.alert(`Pembayaran berhasil dengan ${selectedBank} transfer.`);
  };

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Memuat detail mobil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pembayaran</Text>

      <View style={styles.item}>
        {data ? (
          <>
            <Image source={{ uri: data.img }} style={styles.carImage} />
            <View>
              <Text>{data.name}</Text>
              <Text style={styles.amount}>Rp {data.price.toLocaleString('id-ID')}</Text>
            </View>
          </>
        ) : (
          <Text>Loading car details...</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Pilih Bank Transfer</Text>
      <View style={styles.bankOptions}>
        {['BCA', 'BNI', 'Mandiri'].map((bank) => (
          <TouchableOpacity
            key={bank}
            style={[styles.bankOption, selectedBank === bank && styles.selectedBank]}
            onPress={() => setSelectedBank(bank)}
          >
            <Text>{bank} Transfer</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.promo}>
        <Text style={styles.promoLabel}>% Pakai Kode Promo</Text>
        <TextInput
          style={styles.promoInput}
          placeholder="Tulis catatanmu di sini"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyPromo}>
          <Text style={styles.applyButtonText}>Terapkan</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.total}>Rp {totalAmount.toLocaleString('id-ID')}</Text>

      <TouchableOpacity style={styles.payButton} onPress={makePayment}>
        <Text style={styles.payButtonText}>Bayar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  carImage: { width: 60, height: 40, marginRight: 15 },
  amount: { color: 'green', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  bankOptions: { marginTop: 10 },
  bankOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedBank: { backgroundColor: '#e0ffe0', borderColor: 'green' },
  promo: { marginTop: 20, marginBottom: 20 },
  promoLabel: { fontSize: 14, marginBottom: 5 },
  promoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: { color: '#fff' },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  payButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: { color: '#fff', fontSize: 18 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PaymentScreen;
