import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    settings: {}
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action) => {
            state.settings = action.payload
        }
    }
})

const { actions, reducer } = settingsSlice

export const { setSettings } = actions

export default reducer