import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getData = createAsyncThunk(
  'cars/getData', // Action type untuk Redux
  async (id, { rejectWithValue }) => { // Gunakan _ karena parameter pertama tidak dibutuhkan
    try {
        const res = await axios.get(`https://ugly-baboon-brambt8ihpod-c5531254.koyeb.app/api/v1/cars/${id}`);
          console.log('API Response:' ,res.data);
      const { data } = res.data;
      return data; // Mengembalikan data mobil dari API
    } catch (e) {
      // Menangani error dan mengembalikan pesan kesalahan yang lebih informatif
      if (e.response && e.response.data && e.response.data.message) {
        return rejectWithValue(e.response.data.message); // Mengembalikan pesan kesalahan spesifik dari API
      } else {
        return rejectWithValue('Something went wrong'); // Pesan kesalahan umum jika tidak ada response yang valid
      }
    }
  }
);
export const getAllCars = createAsyncThunk(
    'cars/getAllCars', // Action type untuk Redux
    async (_, { rejectWithValue }) => { // Tidak memerlukan parameter `id`
      try {
        const res = await axios.get('https://ugly-baboon-brambt8ihpod-c5531254.koyeb.app/api/v1/cars');
        console.log('API Response:', res.data);
        const { data } = res.data; // Mendapatkan data dari API response
        return data; // Mengembalikan data mobil dari API
      } catch (e) {
        // Menangani error jika terjadi kesalahan
        if (e.response && e.response.data && e.response.data.message) {
          return rejectWithValue(e.response.data.message); // Mengembalikan pesan kesalahan dari API
        } else {
          return rejectWithValue('Something went wrong'); // Pesan kesalahan umum
        }
      }
    }
  );
