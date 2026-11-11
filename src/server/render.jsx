require("dotenv").config();
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useRoutes, matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import { QueryClient, dehydrate, HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

import { determineUserLang } from '../common/i18n';
import { forSPARouters } from '../../src/router';
import { forSSRRouters } from './public/router/ssrRouters';

const App = ({ lang, search, location }) => useRoutes(forSPARouters({ lang, search, location }));

export default async (req, res, store) => {
  const { path, query } = req;
  const context         = {};
  const lang            = determineUserLang(req.acceptsLanguages(), path);
  const queryClient     = new QueryClient();

  // 1. 💡 加上 await 把 Promise 解開成真正的路由陣列
  const rawRoutes = await forSSRRouters();
  const routes = Array.isArray(rawRoutes) ? rawRoutes : (rawRoutes?.routes || [rawRoutes]);
  
  const cleanPath = path.replace(new RegExp(`^/${lang}`), '') || '/';

  // 2. 💡 真正的自動化核心：巡訪路由表，自動抓取對應的 loadServerData 進行 prefetch
  const prefetchPromises = routes.map((route) => {
    if (!route || !route.path) return null;
    const match = matchPath({ path: route.path, end: route.exact || false }, cleanPath);
    
    // 只要網址匹配成功，且該路由有定義 loadServerData，自動在伺服器端預抓資料！
    if (match && route.loadServerData) {
      return queryClient.prefetchQuery(route.loadServerData);
    }
    return null;
  }).filter(Boolean);

  // 3. 等伺服器把資料全部抓完
  await Promise.all(prefetchPromises);

  // 4. 開始渲染畫面
  const content = renderToString(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <StaticRouter 
            context={context}
            location={path} 
            basename={`/${lang}`}
          >
              <App 
                lang={lang} 
                search={query}
                location={path}
              />
          </StaticRouter>
        </HydrationBoundary>
      </QueryClientProvider>
    </Provider>,
  );

  const helmet = Helmet.renderStatic();
  const helmetToString = Object.keys(helmet)
    .filter((key) => helmet[key].toString() !== '')
    .map((item) => helmet[item].toString());

  const dehydratedState = dehydrate(queryClient);
  const serializedState = serialize(store.getState(), { isJSON: true });
  const serializedDehydratedState = serialize(dehydratedState, { isJSON: true });

  return (`
    <!DOCTYPE html>
    <html lang="${lang}">
      <head>
        ${helmetToString.join('\n')}
        <meta charset="utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no,email=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" type="text/css" href="/css/main.css" />
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.__initialData__ = ${serializedState};
          window.__REACT_QUERY_STATE__ = ${serializedDehydratedState};
        </script>
        <script type="module" defer src="/client.js"></script>
        <script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
      </body>
    </html>
  `);
};