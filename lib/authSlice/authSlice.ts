// Define the shape of the auth slice state
import {User} from "@/interfaces";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    user: User | null;
}

const initializeUser = () => {
    const user = window.localStorage.getItem('neverPosUser');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}
// Initial state with correct typing
const initialState: AuthState = {
    user: initializeUser(),
};

// Create slice with proper type annotations
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        }
    }
});

// Export actions and reducer
export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;