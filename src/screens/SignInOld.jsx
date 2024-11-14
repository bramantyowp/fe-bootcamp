import { KeyboardAvoidingView, View, Text, Image, TextInput, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useReducer, useState } from 'react'
import Button from '../components/Button'
import { Link, useNavigation } from '@react-navigation/native'
import ModalPopup from '../components/Modal'
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const initialFormState = {
  email: '',
  password: '',
}

export default function SignIn() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState(initialFormState)

  const handleChange = (val, name) => {
    setFormData({
      ...formData,
      [name]: val
    });
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://192.168.100.2:3000/api/v1/auth/signin",
        JSON.stringify(formData), {
        headers: {
          "Content-Type": 'application/json'
        }
      }
      )
      const { data } = res.data
      console.log('res', data)
      await AsyncStorage.setItem('token', data.token)
      await AsyncStorage.setItem('user', JSON.stringify({
        fullname: data.user.fullname,
        email: data.user.email,
      }))
      setModalVisible(true)
      setErrorMessage(null)
    } catch (e) {
      setModalVisible(true)
      setErrorMessage(e.response.data.message)
    }
  }

  useEffect(() => {
    if (modalVisible === true) {
      if (errorMessage === null) navigation.navigate('HomeTabs', { screen: 'Profile' })
      setTimeout(() => {
        setModalVisible(false)
        setErrorMessage(null)
      }, 1000)
    }
  }, [modalVisible])

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.authWrapper}>
        <View style={{ flex: 1 }}>
          <Image source={require('../assets/images/logo_tmmin.png')} />
          <Text style={styles.authTitle}>Welcome Back!</Text>
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder='Contoh: johndee@gmail.com' onChangeText={(text) => handleChange(text, 'email')} />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput style={styles.input} secureTextEntry={true}
                placeholder='6+ Karakter' onChangeText={(text) => handleChange(text, 'password')} />
            </View>
            <Button
              onPress={handleSubmit}
              title={'Sign In'}
              color={'#5CB85F'}
            />
          </View>
          <View>
            <Text style={styles.authFooterText}>Don’t have an account? <Link screen="SignUp">Sign Up for free</Link></Text>
          </View>
          <ModalPopup visible={modalVisible}>
            <View style={styles.modalBackground}>
              {errorMessage !== null ?
                <>
                  <Icon size={32} name={'x-circle'} />
                  {Array.isArray(errorMessage) ?
                    errorMessage.map((e) => {
                      return <Text>{e.message}</Text>
                    })
                    :
                    <Text>{errorMessage}</Text>
                  }
                </>
                :
                <>
                  <Icon size={32} name={'check-circle'} />
                  <Text>Berhasil Login!</Text>
                </>
              }
            </View>
          </ModalPopup>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  authWrapper: {
    flex: 1,
    padding: 20
  },
  authTitle: {
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    marginVertical: 20
  },
  inputWrapper: {
    marginBottom: 20
  },
  inputLabel: {
    fontWeight: 700,
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  authFooterText: {
    marginTop: 10,
    fontWeight: 500,
    textAlign: "center"
  },
  modalBackground: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 20,
    borderRadius: 4,
    padding: 20
  }
})