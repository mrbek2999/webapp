import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'orders',
    initialState: {orders: [], message: false},
    reducers:{
        getOrders: (state,action)=>{
            state.orders = action.payload
        },
        saveOrders: (state,action)=>{
            state.orders.unshift(action.payload)
            state.message = true
        },
        deleteToOrders: (state,action)=>{
            state.orders = state.orders.filter(item=>item.id !== action.payload.id)
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

export const getAllOrders = () => apiCall({
    url: 'orders/',
    method: 'GET',
    onSuccess: slice.actions.getOrders().type
})

export const ordersSave = (data) => apiCall({
    url: 'orders/',
    method: 'POST',
    onSuccess: slice.actions.saveOrders.type,
    onFail: slice.actions.messageFail.type,
    data,
})

export const deleteOrders = (data) => apiCall({
    url: 'orders/'+data.id+'/',
    method: 'DELETE',
    onSuccess: slice.actions.deleteToOrders.type,
    onFail: slice.actions.messageFail.type,
})

export default slice.reducer
export const {messageReset} = slice.actions