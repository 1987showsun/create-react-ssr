import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { batchedSubscribe } from 'redux-batched-subscribe';

// redusers
import home from './reducers/home';
import manage from './reducers/manage';

export default configureStore({
    reducer: {
        home,
        manage
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: [batchedSubscribe((notify) => notify())],
})