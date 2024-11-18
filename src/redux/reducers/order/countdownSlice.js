import { createSlice } from '@reduxjs/toolkit';

const countdownSlice = createSlice({
  name: 'countdown',
  initialState: {
    expiryDate: Date.now() + 24 * 60 * 60 * 1000, // 24 jam dari sekarang
    timeLeft: 24 * 60 * 60 * 1000, // Initial timeLeft set ke 24 jam
  },
  reducers: {
    setExpiryDate: (state, action) => {
      state.expiryDate = action.payload;
      state.timeLeft = action.payload - Date.now(); // Menghitung timeLeft
    },
    setTimeLeft: (state) => {
      const timeRemaining = state.expiryDate - Date.now(); // Menghitung waktu tersisa
      state.timeLeft = timeRemaining > 0 ? timeRemaining : 0; // Jangan biarkan timeLeft negatif
    },
  },
});

export const { setExpiryDate, setTimeLeft } = countdownSlice.actions;

export default countdownSlice.reducer;
