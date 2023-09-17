import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'product',
    initialState: {products: []},
    reducers:{
        getAllProduct: (state,action)=>{
            state.products = action.payload
        }
    }
})

export const getProducts = () => apiCall({
    url: 'products/',
    method: 'GET',
    onSuccess: slice.actions.getAllProduct.type
})

export default slice.reducer