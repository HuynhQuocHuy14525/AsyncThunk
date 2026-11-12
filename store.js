import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";

const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productsReducer,
        users: usersReducer,
        posts: postsReducer,
    },
});

export default store;