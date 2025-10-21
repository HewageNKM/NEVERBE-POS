import { CartItem, Order } from "@/interfaces";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getPosCart } from "@/app/actions/invoiceAction";

interface InvoiceSlice {
  items: CartItem[];
  invoiceId: string | null;
  showPaymentDialog: boolean;
  isInvoiceLoading: boolean;

  previewInvoice: boolean;
  previewOrder: Order | null;
}

const initialState: InvoiceSlice = {
  previewInvoice: false,
  invoiceId: null,
  previewOrder: null,
  isInvoiceLoading: false,
  showPaymentDialog: false,
  items: [],
};

const generateInvoiceId = (nodeId: string = "P") => {
  const timePart = Date.now().toString(36).toUpperCase().padStart(7, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timePart}${nodeId}${randomPart}`;
};

export const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    setIsInvoiceLoading: (state, action: PayloadAction<boolean>) => {
      state.isInvoiceLoading = action.payload;
    },
    setShowPaymentDialog: (state, action: PayloadAction<boolean>) => {
      state.showPaymentDialog = action.payload;
    },
    setPreviewInvoice: (state, action: PayloadAction<boolean>) => {
      state.previewInvoice = action.payload;
    },

    initializeInvoicedId: (state) => {
      let invoiceId = window.localStorage.getItem("posInvoiceId");
      if (!invoiceId) {
        invoiceId = generateInvoiceId();
        window.localStorage.setItem("posInvoiceId", invoiceId);
      }
      state.invoiceId = invoiceId;
    },
    setPreviewOrder: (state, action: PayloadAction<Order | null>) => {
      state.previewOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosCartItems.pending, (state) => {
      state.isInvoiceLoading = true;
    });
    builder
      .addCase(getPosCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isInvoiceLoading = false;
      })
      .addCase(getPosCartItems.rejected, (state) => {
        state.isInvoiceLoading = false;
      });
  },
});
export const getPosCartItems = createAsyncThunk(
  "invoice/getPosCartItems",
  async (arg, thunkAPI) => {
    try {
      return await getPosCart();
    } catch (e) {
      console.error(e);
      return thunkAPI.rejectWithValue(e.response);
    }
  }
);
export const {
  setItems,
  clearPreviewOrder,
  setIsInvoiceLoading,
  setShowPaymentDialog,
  setPreviewInvoice,
  setPreviewOrder,
  initializeInvoicedId,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
