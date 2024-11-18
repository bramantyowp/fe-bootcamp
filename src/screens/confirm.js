import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const PaymentProofUpload = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',  // Change to 'mixed' for both image and document
        includeBase64: false,
        quality: 1,
        maxWidth: 1000,
        maxHeight: 1000,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setSelectedImage(response.assets[0].uri); // Save the image URI to display
        }
      }
    );
  };

  const handleSubmit = () => {
    if (selectedImage) {
      // Here, you would handle uploading the image to your server.
      console.log('Uploading image:', selectedImage);
      setModalVisible(false);
      alert('Bukti Pembayaran Berhasil Dikirim!');
    } else {
      alert('Harap pilih bukti pembayaran terlebih dahulu!');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Unggah Bukti Pembayaran" onPress={() => setModalVisible(true)} />

      {/* Modal for Image Upload */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.title}>Unggah Bukti Pembayaran</Text>
            <Text style={styles.description}>
              Pilih gambar bukti pembayaran Anda dari galeri.
            </Text>

            {/* Display selected image */}
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.noImageText}>Tidak ada gambar yang dipilih</Text>
            )}

            {/* Button to select image */}
            <TouchableOpacity onPress={openImagePicker} style={styles.selectImageButton}>
              <Text style={styles.selectImageText}>Pilih Gambar</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button title="Kirim Bukti Pembayaran" onPress={handleSubmit} />
            <Button title="Tutup" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  selectImageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectImageText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PaymentProofUpload;
