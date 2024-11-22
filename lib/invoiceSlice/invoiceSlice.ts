import {CartItem} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getPosCart} from "@/app/actions/invoiceAction";
import {uuidv4} from "@firebase/util";

interface InvoiceSlice {
    items: CartItem[],
    invoiceId: string | null,
    showPaymentDialog: boolean,
    isInvoiceLoading: boolean,
    previewInvoice: boolean
}

const initialState: InvoiceSlice = {
    previewInvoice: false,
    invoiceId: null,
    isInvoiceLoading: false,
    showPaymentDialog: false,
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
        setShowPaymentDialog: (state, action: PayloadAction<boolean>) => {
            state.showPaymentDialog = action.payload
        },
        setPreviewInvoice: (state, action: PayloadAction<boolean>) => {
            state.previewInvoice = action.payload
        },
        initializeInvoicedId: (state) => {
            let invoiceId = window.localStorage.getItem("posInvoiceId");
            if (invoiceId == null) {
                invoiceId = uuidv4().replace(/-/g, '').substring(0, 5);
                window.localStorage.setItem("posInvoiceId", invoiceId);
            }
            state.invoiceId = invoiceId;
        }
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
export const {setItems, setIsInvoiceLoading, setShowPaymentDialog, setPreviewInvoice, initializeInvoicedId} = invoiceSlice.actions
export default invoiceSlice.reducer