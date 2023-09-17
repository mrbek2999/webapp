import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'cart',
    initialState: {cart: [], cart_single: false, message: false},
    reducers:{
        getCart: (state,action)=>{
            state.cart = action.payload
        },
        saveCart: (state,action)=>{
            state.cart.unshift(action.payload)
            state.message = true
        },
        editCart: (state,action)=>{
            state.cart = state.cart.map(item=>item.id === action.payload.id ? action.payload : item)
            state.message = 'edited'
        },
        deleteToCart: (state,action)=> {
            state.cart = state.cart.filter(item => item.id !== action.payload.id)
            state.message = 'deleted'
        },
        messageReset: (state,action)=>{
            state.message = false
        },
        messageFail: (state,action)=>{
            state.message = 'error'
        }
    }
})

export const getAllCart = () => apiCall({
    url: 'cart/',
    method: 'GET',
    onSuccess: slice.actions.getCart.type
})

export const cartSave = (data) => apiCall({
    url: 'cart/',
    method: 'POST',
    onSuccess: slice.actions.saveCart.type,
    onFail: slice.actions.messageFail.type,
    data,
})

export const editMyCart = (data) => apiCall({
    url: 'cart/' + data.id + '/',
    method: 'PUT',
    onSuccess: slice.actions.editCart.type,
    data,
})
export const deleteCart = (data) => apiCall({
    url: 'cart/'+data.id+'/',
    method: 'DELETE',
    onSuccess: slice.actions.deleteToCart.type,
})

export default slice.reducer
export const {messageReset} = slice.actions