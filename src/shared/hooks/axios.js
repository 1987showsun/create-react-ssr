import axios from 'axios';

const API_PATH = process.env.API_PATH || "";

export default axios.create({
    baseURL: API_PATH,
    timeout: 1000,
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': 'application/json',
    }
});

axios.interceptors.request.use((config) => {
    // 在發送請求之前做一些事情
    
    const JWT_TOKEN = localStorage.getItem('AUTH_TOKEN');
    if( JWT_TOKEN ){
        config = {
            ...config,
            Authorization: `bearer ${JWT_TOKEN}`
        }
    }else{
        delete config.Authorization
    }

    return config;
  }, (error) => {
    // 執行請求錯誤的操作
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    // 任何位於 2xx 範圍內的狀態代碼都會導致此函數觸發
    // 對響應數據做一些事情
    return response;
}, (error) => {
    // 任何超出 2xx 範圍的狀態代碼都會導致此功能觸發
    // 做一些響應錯誤的事情
    return Promise.reject(error);
});