import {createSlice} from "@reduxjs/toolkit";
import {apiCall} from "./apiAction";

const slice = createSlice({
    name: 'documents',
    initialState: {documents: [], document_single: false, message: false},
    reducers:{
        getDocuments: (state,action)=>{
            state.documents = action.payload
        },
        getOneDocument: (state,action)=>{
            state.document_single = action.payload
        },
        saveDocument: (state,action)=>{
            state.documents.unshift(action.payload)
            state.message = true
        },
        editDocument: (state,action)=>{
            state.document_single = false
            state.message = true
        },
        deleteToDocument: (state,action)=>{
            state.documents = state.documents.filter(item=>item.id !== action.payload.id)
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

export const getAlLDocuments = () => apiCall({
    url: 'documents/',
    method: 'GET',
    onSuccess: slice.actions.getDocuments.type
})

export const documentSave = (data) => apiCall({
    url: 'documents/',
    method: 'POST',
    onSuccess: slice.actions.saveDocument.type,
    onFail: slice.actions.messageFail.type,
    headers: {
        "Content-Type": "multipart/form-data",
    },
    data,
})

export const getDocument = (id) => apiCall({
    url: 'documents/'+id,
    method: 'GET',
    onSuccess: slice.actions.getOneDocument.type,
})

export const editSaveDocument = (data) => apiCall({
    url: 'documents/'+data.id+'/',
    method: 'PUT',
    onSuccess: slice.actions.editDocument.type,
    onFail: slice.actions.messageFail.type,
    headers: {
        "Content-Type": "multipart/form-data",
    },
    data,
})

export const deleteDocument = (data) => apiCall({
    url: 'documents/'+data.id+'/',
    method: 'DELETE',
    onSuccess: slice.actions.deleteToDocument.type,
    onFail: slice.actions.messageFail.type,
})

export default slice.reducer
export const {messageReset} = slice.actions