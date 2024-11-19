import {configureStore} from "@reduxjs/toolkit";
import {authSlice} from "@/lib/authSlice/authSlice";
import {invoiceSlice} from "@/lib/invoiceSlice/invoiceSlice";
import {productSlice} from "@/lib/prodcutSlice/productSlice";
import {alertSlice} from "@/lib/alertSlice/alertSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
            invoice: invoiceSlice.reducer,
            product: productSlice.reducer,
            alert: alertSlice.reducer
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
