import { configureStore } from "@reduxjs/toolkit"
import patientReducer from "./slices/patientSlice"
import modalReducer from "./slices/modalSlice"
import userReducer from "./slices/userSlice"
import settingsReducer from "./slices/settingsSlice"

export const store = configureStore({
    reducer: {
        patient: patientReducer,
        modal: modalReducer,
        user: userReducer,
        settings: settingsReducer
    }
})