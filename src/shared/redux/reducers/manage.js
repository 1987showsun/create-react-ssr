import { createSlice } from '@reduxjs/toolkit';
import { fetchManageData } from '../actions/manage';

const initialState = {
    data : null
};

export const manageSlice = createSlice({
    name          : 'manage',
    initialState  : initialState,
    reducers      : {
        clearManageData: (state) => {
            state.data = null;
        },
    },
    // 4. 處理 Axios 的三種非同步生命週期狀態
    extraReducers : (builder) => { 
        builder.addCase(fetchManageData.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchManageData.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload; // Axios 拿到的 JSON 資料
        }).addCase(fetchManageData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload; // 透過 rejectWithValue 傳進來的錯誤訊息
        });
    },
});

export const { clearManageData } = manageSlice.actions;
export default manageSlice.reducer;