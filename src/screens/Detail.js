import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Markdown from 'react-native-markdown-display';
import Button from '../components/Button';
import { Row, Col } from '../components/Grid';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/formatCurrency';
import { useDispatch } from 'react-redux';
import { resetState } from '../redux/reducers/cars';

const md = `## Include
  - Apa saja yang termasuk dalam paket misal durasi max 12 jam
  - Sudah termasuk bensin selama 12 jam
  - Sudah termasuk Tiket Wisata
  - Sudah termasuk pajak
  
  ## Exclude
  - Tidak termasuk biaya makan sopir Rp 75.000/hari
  - Jika overtime lebih dari 12 jam akan ada tambahan biaya Rp 20.000/jam
  - Tidak termasuk akomodasi penginapan`;

export default function Detail({ route }) {
  const navigation = useNavigation();
  const { data } = route.params; // Mengambil data yang dikirimkan melalui route.params
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [datar, setDatar] = useState(null);

  // Set data setelah diterima dari props (route.params)
  useEffect(() => {
    if (data) {
      setDatar(data);
      setIsLoading(false); // Data sudah siap, matikan loading
    }
  }, [data]);

  // Jika sedang loading, tampilkan indikator loading
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Jika data tidak ada, tampilkan pesan error
  if (!datar) {
    return <Text>Data tidak tersedia</Text>;
  }

  return (
    <View style={styles.container}>
      <Button style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon size={32} name={'arrow-left'} color={'#000'} />
      </Button>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.heading}>
          <Text style={styles.title}>{datar.name}</Text>
          <Row style={styles.iconWrapper} gap={5}>
            <Col style={styles.textIcon}>
              <Icon size={14} name={'users'} color={'#8A8A8A'} />
              <Text style={styles.capacityText}>{datar.seat}</Text>
            </Col>
            <Col style={styles.textIcon}>
              <Icon size={14} name={'briefcase'} color={'#8A8A8A'} />
              <Text style={styles.capacityText}>{datar.baggage}</Text>
            </Col>
          </Row>
          <Image
            style={styles.image}
            source={{ uri: datar.img }}
            height={200}
            width={200}
            resizeMode="contain"
          />
        </View>
        <Markdown style={styles.details}>{md}</Markdown>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.price}>{formatCurrency.format(datar.price || 0)}</Text>
        <Button
          color="#3D7B3F"
          title="Lanjutkan Pembayaran"
          onPress={() => {
            navigation.navigate('Payment', { id: datar.id, data: datar }); // Navigasi ke Payment
            dispatch(resetState()); // Reset state setelah navigasi
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingTop: 30,
    padding: 20,
  },
  heading: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  iconWrapper: {
    marginBottom: 20,
  },
  image: {
    marginBottom: 20,
  },
  details: {
    body: {
      fontSize: 16,
      marginBottom: 10,
    },
    bullet_list: {
      marginBottom: 10,
    },
    heading2: {
      marginBottom: 10,
      fontSize: 18,
      fontFamily: 'PoppinsBold',
    },
  },
  price: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#eeeeee',
    padding: 20,
    marginTop: 'auto', // Menjaga footer tetap di bawah
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 9,
    backgroundColor: 'transparent',
  },
  textIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
