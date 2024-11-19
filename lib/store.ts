import {configureStore} from "@reduxjs/toolkit";
import {authSlice} from "@/lib/authSlice/authSlice";
import {invoiceSlice} from "@/lib/invoiceSlice/invoiceSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
            invoice: invoiceSlice.reducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
