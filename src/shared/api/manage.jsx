import axios from "../hooks/axios";

export const getManageApi = async () => {
    const response = await axios.get('https://randomuser.me/api');
    return response.data; // 回傳資料
};