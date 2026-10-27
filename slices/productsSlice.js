import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dữ liệu giả, coi như "server" đang giữ
const fakeProducts = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Chuột", price: 25 },
    { id: 3, name: "Bàn phím", price: 80 },
];

// Hàm giả lập gọi API: chờ 2 giây rồi trả dữ liệu
const fakeApi = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            // Đổi true thành false để thử trạng thái LỖI
            const ok = true;
            if (ok) resolve(fakeProducts);
            else reject(new Error("Không kết nối được server"));
        }, 2000);
    });

export const fetchProducts = createAsyncThunk("products/fetchProducts", async() => {
    const res = await fetch("https://dummyjson.com/products?limit=10");
    if (!res.ok) throw new Error(`Lỗi ${res.status}`); // fetch không tự báo lỗi 404/500
    const data = await res.json();

    // API trả về { products: [...] }, mỗi sp có "title" chứ không phải "name"
    return data.products.map((p) => ({
        id: p.id,
        name: p.title,
        price: p.price,
    }));
});

// 2. Slice có status + error
const productsSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    // 3. Xử lý 3 trạng thái
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer;