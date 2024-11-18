import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Row, Col } from '../components/Grid'; // Assuming Row/Col is a custom layout component

const PaymentScreen = ({ route }) => {
  const { data } = route.params; // Destructure directly to avoid unnecessary variables
  const [selectedBank, setSelectedBank] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [originalAmount, setOriginalAmount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation();

  // Set up the initial amount based on the incoming data
  useEffect(() => {
    if (data) {
      setOriginalAmount(data.price);
      setTotalAmount(data.price);
    } else {
      Alert.alert('Data mobil tidak ditemukan');
    }
  }, [data]); // Only run this effect when 'data' changes

  // Function to handle promo code application
  const applyPromo = () => {
    let discount = 0;
    if (promoCode === 'DISKON50') {
      discount = 50000;
      Alert.alert('Kode promo DISKON50 diterapkan!');
    } else if (promoCode === 'DISKON20') {
      discount = 23000;
      Alert.alert('Kode promo DISKON20 diterapkan!');
    } else {
      Alert.alert('Kode promo tidak valid!');
    }
    setTotalAmount(originalAmount - discount);
  };

  // Function to move to the next step
  const handleNextStep = () => {
    if (currentStep === 1 && selectedBank) {
      setCurrentStep(2); // Move to the next step if bank is selected
    } else if (currentStep === 2) {
      setCurrentStep(3); // Move to the final step
    }
  };

  // If no car data, show loading indicator
  if (!data) {
    return <ActivityIndicator size="large" color="#00A000" />;
  }

  return (
    <View style={styles.container}>
      {/* Progress Stepper at the Top */}
      <View style={styles.steps}>
        <View style={[styles.stepWrapper, currentStep >= 1 && styles.stepActive]}>
          <Text style={[styles.stepText, currentStep >= 1 && styles.stepActiveText]}>Pilih Metode</Text>
        </View>
        <View style={[styles.stepWrapper, currentStep >= 2 && styles.stepActive]}>
          <Text style={[styles.stepText, currentStep >= 2 && styles.stepActiveText]}>Bayar</Text>
        </View>
        <View style={[styles.stepWrapper, currentStep >= 3 && styles.stepActive]}>
          <Text style={[styles.stepText, currentStep >= 3 && styles.stepActiveText]}>Tiket</Text>
        </View>
      </View>

      {/* Car Details Section */}
      <View style={styles.item}>
        <Image source={{ uri: data.img }} style={styles.carImage} />
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{data.name}</Text>
          <Row style={styles.iconWrapper} gap={5}>
            <Col style={styles.textIcon}>
              <Icon size={14} name="users" color="#8A8A8A" />
              <Text style={styles.capacityText}>{data.seat}</Text>
            </Col>
            <Col style={styles.textIcon}>
              <Icon size={14} name="briefcase" color="#8A8A8A" />
              <Text style={styles.capacityText}>{data.baggage}</Text>
            </Col>
          </Row>
          <Text style={styles.amount}>Rp {data.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Select Bank Transfer */}
      <Text style={styles.sectionTitle}>Pilih Bank Transfer</Text>
      <Text style={styles.sectionDescription}>
        Kamu bisa membayar dengan transfer melalui ATM, Internet Banking atau Mobile Banking.
      </Text>
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

      {/* Promo Code Section */}
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

      {/* Payment Button and Total Amount */}
      <View style={styles.footerContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, !selectedBank && styles.disabledPayButton]}
          onPress={() => {
            if (!selectedBank) {
              Alert.alert('Silakan pilih metode transfer terlebih dahulu.');
            } else {
              navigation.navigate('OrderDetail', {
                id: data.id,
                data,
                totalAmount,
                selectedBank, // Pass selectedBank here
              });
            }
          }}
          disabled={!selectedBank}
        >
          <Text style={styles.payButtonText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  steps: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  stepText: {
    fontSize: 16,
    color: '#A0A0A0', // Inactive steps color
  },
  stepActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00A000', // Active step underline color
  },
  stepActiveText: {
    color: '#00A000', // Active step text color
    fontWeight: 'bold',
  },
  item: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  carImage: { width: 80, height: 50, marginRight: 15, borderRadius: 5 },
  carInfo: { flex: 1 },
  carName: { fontWeight: 'bold', fontSize: 16 },
  capacityText: { fontSize: 14, color: '#A0A0A0' },
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
  footerContainer: { paddingVertical: 30, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  total: { fontSize: 20, fontWeight: 'bold' },
  payButton: {
    backgroundColor: '#00A000',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: { color: '#FFF', fontSize: 18 },
  disabledPayButton: {
    backgroundColor: '#D0D0D0', // Grey color when the button is disabled
  },
});

export default PaymentScreen;
