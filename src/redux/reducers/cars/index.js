import { createSlice } from '@reduxjs/toolkit';
import { getAllCars } from './api'; // Gunakan action getAllCars yang mengambil semua mobil

const initialState = {
  cars: [], // Menggunakan array untuk menyimpan data mobil
  status: 'idle', // Status: 'idle', 'loading', 'success', 'failed'
  message: null, // Pesan error jika ada
};

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    resetState: (state) => {
      state.cars = [];
      state.status = 'idle';
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Menangani status loading
      .addCase(getAllCars.pending, (state) => {
        state.status = 'loading';
      })
      // Menangani jika API berhasil
      .addCase(getAllCars.fulfilled, (state, action) => {
        state.status = 'success';
        state.cars = action.payload; // Simpan data mobil yang didapat dari API
      })
      // Menangani jika API gagal
      .addCase(getAllCars.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload; // Menyimpan pesan error jika ada
      });
  },
});

export default carSlice.reducer;
export const { resetState } = carSlice.actions;
export {getAllCars};