import {CartItem} from "@/interfaces";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface InvoiceSlice {
    items: CartItem[]
}
const initialState:InvoiceSlice = {
    items: []
}

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload)
        },
        removeItem: (state, action: PayloadAction<CartItem>) => {
            state.items = state.items.filter(item => item.itemId !== action.payload.itemId && item.variantId !== action.payload.variantId && item.size !== action.payload.size)
        }
    }
})

export const {addItem, removeItem} = invoiceSlice.actions
export default invoiceSlice.reducer