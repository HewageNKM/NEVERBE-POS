import {CartItem} from "@/interfaces";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface InvoiceSlice {
    items: CartItem[],
    isInvoiceLoading: boolean
}
const initialState:InvoiceSlice = {
    isInvoiceLoading: false,
    items: []
}

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload
        },
        setIsInvoiceLoading: (state, action: PayloadAction<boolean>) => {
            state.isInvoiceLoading = action.payload
        },
    }
})

export const {setItems,setIsInvoiceLoading} = invoiceSlice.actions
export default invoiceSlice.reducer