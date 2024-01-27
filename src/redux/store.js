import { configureStore } from "@reduxjs/toolkit"
import patientReducer from './slices/patientSlice'
import modalReducer from './slices/modalSlice'
import userReducer from "./slices/userSlice"

export const store = configureStore({
    reducer: {
        patient: patientReducer,
        modal: modalReducer,
        user: userReducer
    }
})