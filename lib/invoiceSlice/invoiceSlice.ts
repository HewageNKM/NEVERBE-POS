import {CartItem, Order} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getPosCart} from "@/app/actions/invoiceAction";

interface InvoiceSlice {
    items: CartItem[],
    invoiceId: string | null,
    showPaymentDialog: boolean,
    isInvoiceLoading: boolean,

    previewInvoice: boolean
    previewOrder: Order | null
}

const initialState: InvoiceSlice = {
    previewInvoice: false,
    invoiceId: null,
    previewOrder: null,
    isInvoiceLoading: false,
    showPaymentDialog: false,
    items: []
}

const generateInvoiceId = () => {
    // Generate a unique alphanumeric order ID with a shorter length
    const timestamp = Date.now().toString(36).slice(-3);  // Take only the last 6 characters of the base-36 timestamp
    const randomPart = Math.random().toString(36).substring(2, 6); // Shorter random part (2 characters)

    return `${timestamp}-${randomPart}`.toUpperCase();
};



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
                invoiceId = generateInvoiceId()
                window.localStorage.setItem("posInvoiceId", invoiceId);
            }
            state.invoiceId = invoiceId;
        },
        setPreviewOrder: (state, action: PayloadAction<Order|null>) => {
            state.previewOrder = action.payload
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
export const {
    setItems,
    clearPreviewOrder,
    setIsInvoiceLoading,
    setShowPaymentDialog,
    setPreviewInvoice,
    setPreviewOrder,
    initializeInvoicedId,
} = invoiceSlice.actions
export default invoiceSlice.reducer