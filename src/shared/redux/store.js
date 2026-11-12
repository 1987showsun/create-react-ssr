import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

// reducers
import home from './reducers/home';
import manage from './reducers/manage';

export default (preloadedState) => configureStore({
    reducer        : {
        home,
        manage
    },
    preloadedState, // 確保正確接收 SSR 水合狀態
    middleware     : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools       : process.env.NODE_ENV !== 'production',
    // 💡 暫時拿掉會引起衝突的 enhancers 陣列或回調函數
});