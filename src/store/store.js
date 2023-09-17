import {configureStore} from '@reduxjs/toolkit'
import {api} from "./middleware/api";
import cart from "./cart"
import product from "./Products"
import categories from "./Categories"
import orders from "./Orders"


export default configureStore({
    reducer: {
        cart, product, categories, orders
    },
    middleware: [
        api,
    ]
})