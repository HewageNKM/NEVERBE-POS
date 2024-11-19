import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AlertSlice {
    title:string,
    buttonTitle:string,
    showAlert:boolean
}

const initialState:AlertSlice = {
    title:"",
    buttonTitle:"",
    showAlert:false
}

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: (state, action: PayloadAction<AlertSlice>) => {
            state.title = action.payload.title
            state.buttonTitle = action.payload.buttonTitle
            state.showAlert = true
        },
        hideAlert: (state) => {
            state.showAlert = false
            state.title = ""
            state.buttonTitle = ""
        }
    }
})

export const {showAlert,hideAlert} = alertSlice.actions
export default alertSlice.reducer