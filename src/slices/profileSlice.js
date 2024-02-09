import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null ,
  userReal: null ,
  loading: false
};

const profileSlice = createSlice({
  name:"profile",
  initialState: initialState,
  reducers: {
    setUser(state, value){
      state.user = value.payload;
    },
    setUserReal(state, value){
      state.userReal = value.payload;
    },
    setLoading(state, value){
      state.user = value.payload;
    }
  },
})
export const {setUser, setUserReal, setLoading} = profileSlice.actions;
export default profileSlice.reducer; 