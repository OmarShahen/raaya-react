import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isShowLoginModal: false,
    isShowSigninModal: false,
    isShowExpertModal: false
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setIsShowLoginModal: (state, action) => {
            state.isShowLoginModal = action.payload.isShowLoginModal
        },
        setIsShowSigninModal: (state, action) => {
            state.isShowSigninModal = action.payload.isShowSigninModal
        },
        setIsShowExpertModal: (state, action) => {
            state.isShowExpertModal = action.payload.isShowExpertModal
        }
    }
})

const { actions, reducer } = modalSlice

export const { setIsShowLoginModal, setIsShowSigninModal, setIsShowExpertModal } = actions

export default reducer