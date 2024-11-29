import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: localStorage.getItem("user") || null, // Load user from localStorage
        token: localStorage.getItem("token") || null,

        signupData: null,
        error: null, // Add error field
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload)); // Save user to localStorage
            } else {
                localStorage.removeItem("user"); // Clear user data on logout
            }
        },
        clearSignupData: (state) => {
            state.signupData = {};
        },
        setSignupData(state, value) {
            state.signupData = {
                fullname: value.payload.fullname,
                email: value.payload.email,
                phoneNumber: value.payload.phoneNumber,
                password: value.payload.password,
                confirmPassword: value.payload.confirmPassword,
                role: value.payload.role,
                file: value.payload.file,
            };
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.signupData = null;
            localStorage.removeItem("user"); // Clear localStorage on logout
        },
        setToken(state, value) {
            state.token = value.payload;
          },
        setError: (state, action) => {
            state.error = action.payload; // Handle errors
        },
    },
});

export const { setLoading, setUser, setToken, clearSignupData, setSignupData, logout, setError } = authSlice.actions;
export default authSlice.reducer;
