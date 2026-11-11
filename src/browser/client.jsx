// src/browser/client.jsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';

import createStore from '../shared/redux/store';
import { forSPARouters } from '../router';

const lang = document.documentElement.lang || 'en';

// 1. 建立前端的 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 5 分鐘內不重複打 API
      refetchOnWindowFocus: false,
    },
  },
});

// 2. 💡 撈取伺服器序列化過來的 React Query 狀態
const dehydratedState = window.__REACT_QUERY_STATE__;
delete window.__REACT_QUERY_STATE__;

const preloadedState = window.__initialData__;
delete window.__initialData__;
const store = createStore(preloadedState);

const App = ({ lang }) => useRoutes(forSPARouters({ lang }));

function Main() {
  return (
    // 3. 💡 用 QueryClientProvider 與 HydrationBoundary 接收伺服器的快取
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Provider store={store}>
          <BrowserRouter basename={`/${lang}`}>
            <App lang={lang} />
          </BrowserRouter>
        </Provider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

hydrateRoot(document.getElementById('root'), <Main />);