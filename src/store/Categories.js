import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'categories',
    initialState: {categories: []},
    reducers:{
        getAllCategories: (state,action)=>{
            state.categories = action.payload
        }
    }
})

export const getCategories = () => apiCall({
    url: 'categories/',
    method: 'GET',
    onSuccess: slice.actions.getAllCategories.type
})

export default slice.reducer