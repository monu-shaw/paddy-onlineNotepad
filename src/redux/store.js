import { configureStore } from '@reduxjs/toolkit'
import  userSlice from './reducers/users'

export const store = configureStore({
  reducer: {
    user: userSlice
  },
})