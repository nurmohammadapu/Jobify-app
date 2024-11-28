import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        signupData: null,
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
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
        }
    }
});
export const {setLoading, setUser,clearSignupData, setSignupData} = authSlice.actions;
export default authSlice.reducer;


