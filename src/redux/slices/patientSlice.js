import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    patient: {}
}

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatient: (state, action) => {
            state.patient = action.payload
        }
    }
})

const { actions, reducer } = patientSlice

export const { setPatient } = actions

export default reducer