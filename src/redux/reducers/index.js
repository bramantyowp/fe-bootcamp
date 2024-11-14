import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './user';
import  CarSlice  from './cars';

const rootReducer = combineReducers({
    user: userSlice,
    cars: CarSlice,
});

export default rootReducer;
