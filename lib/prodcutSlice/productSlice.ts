import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getInventory} from "@/app/actions/prodcutsAction";

interface ProductSlice {
    products: Item[],
    currentPage: number,
    currentSize: number,
    isLoading: boolean,
    isVariantsFormOpen: boolean,
    selectedItem: Item | null
}

const initialState: ProductSlice = {
    currentSize: 8,
    products: [],
    currentPage: 1,
    isLoading: true,
    isVariantsFormOpen: false,
    selectedItem: null
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Item[]>) => {
            state.products = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setIsVariantsFormOpen: (state, action: PayloadAction<boolean>) => {
            state.isVariantsFormOpen = action.payload
        },
        setSelectedItem: (state, action: PayloadAction<Item | null>) => {
            state.selectedItem = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload
            state.isLoading = false
        }).addCase(getProducts.rejected, (state) => {
            state.isLoading = false
        })
    }
})
export const getProducts = createAsyncThunk('product/getInventory', async ({page, size}: {
    page: number,
    size: number
}, thunkAPI) => {
    try {
        return await getInventory(page, size);
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
});
export const {setProducts, setCurrentPage, setIsLoading, setIsVariantsFormOpen, setSelectedItem} = productSlice.actions
export default productSlice.reducer
