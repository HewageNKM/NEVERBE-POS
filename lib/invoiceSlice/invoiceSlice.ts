import {CartItem} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getPosCart} from "@/app/actions/invoiceAction";

interface InvoiceSlice {
    items: CartItem[],
    isInvoiceLoading: boolean
}

const initialState: InvoiceSlice = {
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
    },
    extraReducers: (builder) => {
        builder.addCase(getPosCartItems.pending, (state) => {
            state.isInvoiceLoading = true
        })
        builder.addCase(getPosCartItems.fulfilled, (state, action) => {
            state.items = action.payload
            state.isInvoiceLoading = false
        }).addCase(getPosCartItems.rejected, (state) => {
            state.isInvoiceLoading = false
        })
    }
})
export const getPosCartItems = createAsyncThunk('invoice/getPosCartItems', async (arg, thunkAPI) => {
    try {
        return await getPosCart();
    } catch (e) {
        console.error(e);
        return thunkAPI.rejectWithValue(e.response);
    }
});
export const {setItems, setIsInvoiceLoading} = invoiceSlice.actions
export default invoiceSlice.reducer