import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Bài 1: GET danh sách người dùng bằng createAsyncThunk + rejectWithValue
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return rejectWithValue(`Lỗi HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        return rejectWithValue(err.message || "Không kết nối được server");
    }
});

const usersSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            });
    },
});

export default usersSlice.reducer;

export const selectUsers = (state) => state.users.list;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
