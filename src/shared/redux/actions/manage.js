import { createAsyncThunk } from '@reduxjs/toolkit';
import { getManageApi } from '../../api/manage';

export const fetchManageData = createAsyncThunk('manage/fetchManageData', async (_, { rejectWithValue }) => {
        try {
            // 使用 axios.get，資料會自動包在 response.data 裡面
            const data = await getManageApi();
            return data;
        } catch (error) {
            // Axios 的錯誤處理：若後端有回傳錯誤訊息，可以抓 error.response.data，否則抓 error.message
            const errorMessage = error.response?.data?.message || error.message;
            return rejectWithValue(errorMessage);
        }
    }
);