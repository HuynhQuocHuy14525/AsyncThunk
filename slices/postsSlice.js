import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Bài 2: CRUD bài viết với JSONPlaceholder (GET / POST / PUT / DELETE)
const API = "https://jsonplaceholder.typicode.com/posts";

// READ
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const res = await fetch(`${API}?_limit=10`);
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return await res.json();
});

// CREATE
export const addPost = createAsyncThunk("posts/addPost", async (/** @type {{ title: string, body: string }} */ { title, body }) => {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId: 1 }),
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    const data = await res.json();
    // JSONPlaceholder luôn trả id = 101 -> tạo id riêng để không trùng key
    return { ...data, id: Date.now() };
});

// UPDATE
export const updatePost = createAsyncThunk("posts/updatePost", async (/** @type {{ id: number, title: string, body: string, userId: number }} */ post) => {
    // Bài mới tạo (id > 100) không tồn tại trên server giả -> chỉ cập nhật ở client
    if (post.id > 100) return post;
    const res = await fetch(`${API}/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    return { ...post, ...(await res.json()) };
});

// DELETE
export const deletePost = createAsyncThunk("posts/deletePost", async (/** @type {number} */ id) => {
    if (id <= 100) {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Lỗi ${res.status}`);
    }
    return id;
});

const postsSlice = createSlice({
    name: "posts",
    initialState: {
        items: [],
        status: "idle",
        error: null,
        saving: false, // đang thêm / sửa
        deletingId: null, // id bài đang xóa (hiện loading đúng dòng đó)
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(addPost.pending, (state) => {
                state.saving = true;
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.saving = false;
                state.items.unshift(action.payload);
            })
            .addCase(addPost.rejected, (state, action) => {
                state.saving = false;
                state.error = action.error.message;
            })

            .addCase(updatePost.pending, (state) => {
                state.saving = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.saving = false;
                const i = state.items.findIndex((p) => p.id === action.payload.id);
                if (i !== -1) state.items[i] = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.saving = false;
                state.error = action.error.message;
            })

            .addCase(deletePost.pending, (state, action) => {
                state.deletingId = action.meta.arg;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.deletingId = null;
                state.items = state.items.filter((p) => p.id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.deletingId = null;
                state.error = action.error.message;
            });
    },
});

export default postsSlice.reducer;
