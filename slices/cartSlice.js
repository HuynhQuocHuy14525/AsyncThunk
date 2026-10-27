import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {

        // Thêm vào giỏ
        addToCart: (state, action) => {
            const product = action.payload; // sản phẩm được gửi lên
            const existing = state.items.find((item) => item.id === product.id);

            if (existing) {
                existing.quantity += 1; // đã có trong giỏ → tăng số lượng
            } else {
                state.items.push({...product, quantity: 1 }); // chưa có → thêm mới
            }
        },

        // Tăng số lượng (Inc)
        increaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item) item.quantity += 1;
        },

        // Giảm số lượng (Dec), không cho xuống dưới 1
        decreaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (item && item.quantity > 1) item.quantity -= 1;
        },

        // Xóa 1 sản phẩm
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },

        // Xóa hết
        clearCart: (state) => {
            state.items = [];
        },



    },
});



export default cartSlice.reducer;

export const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

// Danh sách trong giỏ
export const selectCartItems = (state) => state.cart.items;

// Tổng số lượng
export const selectCartCount = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

// Tổng tiền
export const selectCartTotal = (state) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);