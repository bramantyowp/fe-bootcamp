import { createSlice } from '@reduxjs/toolkit';
import { getData } from './api';

const initialState = {
  data: null, // data yang akan diisi dengan hasil fetch API
  status: 'idle', // Status: 'idle', 'loading', 'success', 'failed'
  message: null, // Pesan error jika ada
};

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload; // Pastikan ini sesuai dengan data yang dikembalikan oleh API
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload; // Menyimpan pesan error jika ada
      });
  },
});

export default carSlice.reducer;
