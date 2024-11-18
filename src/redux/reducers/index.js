import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user';
import  CarSlice  from './cars';
import countdownReducer from './order/countdownSlice';
const rootReducer = combineReducers({
    user: userSlice,
    cars: CarSlice,
    countdown: countdownReducer,
});

export default rootReducer;
