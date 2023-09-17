import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'product',
    initialState: {products: [], filtered_products: []},
    reducers:{
        getAllProduct: (state,action)=>{
            state.products = action.payload
        },
        getAllProductNextPage: (state,action)=>{
            state.products.next = action.payload.next
            state.products.results = [...state.products.results, ...action.payload.results]
            // state.products = [...state.products, action.payload]
        },
        getAllFilteredProducts: (state,action)=>{
            state.products = action.payload
        },
        getAllProductTitleFilter: (state,action)=>{
            state.products = action.payload
        },
    }
})

export const getProducts = () => apiCall({
    url: 'products/',
    method: 'GET',
    onSuccess: slice.actions.getAllProduct.type
})

export const getProductNextPage = (nextUrl) => apiCall({
    url: 'products/?'+nextUrl,
    method: 'GET',
    onSuccess: slice.actions.getAllProductNextPage.type
})

export const getProductTitleFilter = (titleUrl) => apiCall({
    url: 'products/?search='+titleUrl,
    method: 'GET',
    onSuccess: slice.actions.getAllProductTitleFilter.type
})

export const getFilteredProducts = (id) => apiCall({
    url: 'products/?categories='+id,
    method: 'GET',
    onSuccess: slice.actions.getAllFilteredProducts.type,
})

export default slice.reducer