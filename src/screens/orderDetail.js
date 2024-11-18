import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import { setExpiryDate, setTimeLeft } from '../redux/reducers/order/countdownSlice';

const OrderDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data, totalAmount, selectedBank } = route.params;
  const [currentBank, setCurrentBank] = useState(selectedBank);

  const timeLeft = useSelector((state) => state.countdown.timeLeft); // Mendapatkan timeLeft dari Redux

  // Fungsi untuk melanjutkan ke Payment Screen
  const proceedToPayment = () => {
    navigation.navigate('Payment', { data, id: data.id });
  };

  // Fungsi untuk merender countdown
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Text style={styles.countdownExpired}>Waktu pembayaran telah habis!</Text>;
    }
    return (
      <Text style={styles.countdownText}>
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </Text>
    );
  };

  // Gunakan useEffect untuk memperbarui state `timeLeft` setiap detik
  useEffect(() => {
    if (currentBank !== selectedBank) {
      setCurrentBank(selectedBank);

      // Update expiryDate ke 24 jam dari sekarang
      const updatedExpiryDate = Date.now() + 24 * 60 * 60 * 1000; // 24 jam
      dispatch(setExpiryDate(updatedExpiryDate)); // Update expiryDate di Redux
    }

    // Set interval untuk memperbarui `timeLeft` setiap detik
    const interval = setInterval(() => {
      dispatch(setTimeLeft()); // Perbarui timeLeft setiap detik
    }, 1000);

    // Clean up interval saat komponen tidak lagi digunakan
    return () => clearInterval(interval);
  }, [dispatch, selectedBank, currentBank]);

  // Gunakan `key` untuk memastikan countdown merender ulang setiap `timeLeft` berubah
  const countdownKey = timeLeft ? timeLeft : Date.now();

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Countdown Timer */}
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownLabel}>Waktu pembayaran tersisa:</Text>
        <Countdown
          key={countdownKey} // Reset countdown setiap kali `timeLeft` berubah
          date={timeLeft + Date.now()} // `timeLeft` sudah dihitung dari expiryDate
          renderer={countdownRenderer}
        />
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <Image source={{ uri: data.img }} style={styles.carImage} />
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{data.name}</Text>
          <Text style={styles.amount}>Rp {data.price.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.transferInfo}>
        <Text style={styles.transferTitle}>Lakukan Transfer ke</Text>
        <Text style={styles.bankName}>{currentBank} Transfer a.n Jeep Bromo Online</Text>

        <View style={styles.accountContainer}>
          <Text style={styles.transferText}>Nomor Rekening</Text>
          <Text style={styles.accountNumber}>xxxx-xxxx-xxxx</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.transferText}>Total Bayar</Text>
          <Text style={styles.amount}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={proceedToPayment}
        >
          <Text style={styles.confirmButtonText}>Konfirmasi Pembayaran</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderListButton}
          onPress={() => navigation.navigate('OrderList')}
        >
          <Text style={styles.orderListButtonText}>Lihat Daftar Pesanan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countdownContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    textAlign: 'center',
  },
  countdownExpired: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100,
  },
  orderDetails: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  carImage: {
    width: 80,
    height: 50,
    marginRight: 15,
    borderRadius: 5,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  amount: {
    color: '#009688',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  transferInfo: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 20,
  },
  transferTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 15,
  },
  transferText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  accountContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orderListButton: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderListButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default OrderDetailScreen;
