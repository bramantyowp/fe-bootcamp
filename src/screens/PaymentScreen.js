import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../redux/reducers/cars/api'; // Ensure path is correct
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Row, Col } from '../components/Grid';
const PaymentScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.cars); // Access state from Redux
  const { id } = route.params;
  const [selectedBank, setSelectedBank] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [originalAmount, setOriginalAmount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (!data && id) {
      dispatch(getData(id));
    }
  }, [dispatch, data, id]);

  useEffect(() => {
    if (data && data.id === id) {
      setOriginalAmount(data.price);
      setTotalAmount(data.price);
    } else {
      Alert.alert('Data mobil tidak ditemukan');
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
        <ActivityIndicator size="large" color="#00A000" />
        <Text style={styles.loadingText}>Memuat detail mobil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon size={32} name="arrow-left" color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Pembayaran</Text>
      </View>

      <View style={styles.steps}>
        <Text style={styles.stepActive}>Pilih Metode</Text>
        <Text style={styles.step}>Bayar</Text>
        <Text style={styles.step}>Tiket</Text>
      </View>

      <View style={styles.item}>
        {data ? (
          <>
            <Image source={{ uri: data.img }} style={styles.carImage} />
            <View style={styles.carInfo}>
              <Text style={styles.carName}>{data.name}</Text>
              <Row style={styles.iconWrapper} gap={5}>
                        <Col style={styles.textIcon}>
                            <Icon size={14} name={'users'} color={'#8A8A8A'} />
                            <Text style={styles.capacityText}>{data.seat}</Text>
                        </Col>
                        <Col style={styles.textIcon}>
                            <Icon size={14} name={'briefcase'} color={'#8A8A8A'} />
                            <Text style={styles.capacityText}>{data.baggage}</Text>
                        </Col>
                    </Row>
              <Text style={styles.amount}>Rp {data.price.toLocaleString('id-ID')}</Text>
            </View>
          </>
        ) : (
          <Text>Loading car details...</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Pilih Bank Transfer</Text>
      <Text style={styles.sectionDescription}>Kamu bisa membayar dengan transfer melalui ATM, Internet Banking atau Mobile Banking</Text>
      <View style={styles.bankOptions}>
        {['BCA', 'BNI', 'Mandiri'].map((bank) => (
          <TouchableOpacity
            key={bank}
            style={[styles.bankOption, selectedBank === bank && styles.selectedBank]}
            onPress={() => setSelectedBank(bank)}
          >
            <Text style={styles.bankText}>{bank} Transfer</Text>
            {selectedBank === bank && <Text style={styles.checkMark}>✔</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.promo}>
        <Text style={styles.promoLabel}>Pakai Kode Promo</Text>
        <View style={styles.promoInputContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Tulis kode promo"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyButton} onPress={applyPromo}>
            <Text style={styles.applyButtonText}>Terapkan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={makePayment}>
          <Text style={styles.payButtonText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 5, marginRight: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  steps: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  step: { color: '#A0A0A0' },
  stepActive: { color: '#00A000', fontWeight: 'bold' },
  item: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  carImage: { width: 80, height: 50, marginRight: 15, borderRadius: 5 },
  carInfo: { flex: 1 },
  carName: { fontWeight: 'bold', fontSize: 16 },
  carDetails: { flexDirection: 'row', marginTop: 5 },
  carDetail: { marginRight: 10, color: '#A0A0A0' },
  icon: { marginRight: 5 },
  amount: { color: 'green', fontWeight: 'bold', marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  sectionDescription: { color: '#A0A0A0', marginBottom: 20 },
  bankOptions: { marginBottom: 20 },
  bankOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  selectedBank: { backgroundColor: '#E0FFE0', borderColor: '#00A000' },
  bankText: { fontWeight: 'bold' },
  checkMark: { color: '#00A000' },
  promo: { marginBottom: 20 },
  promoLabel: { fontSize: 14, marginBottom: 5 },
  promoInputContainer: { flexDirection: 'row', alignItems: 'center' },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  applyButton: {
    backgroundColor: '#00A000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: { color: '#FFF', fontSize: 14 },
  footerContainer: { paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  total: { fontSize: 20, fontWeight: 'bold' },
  expandIcon: { fontSize: 20, color: '#A0A0A0' },
  payButton: {
    backgroundColor: '#00A000',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: { color: '#FFF', fontSize: 18 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: { marginTop: 10, fontSize: 16 },
});

export default PaymentScreen;
