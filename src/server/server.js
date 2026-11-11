require("dotenv").config();
import express from 'express';
import queryString from 'query-string';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { matchRoutes } from 'react-router-config';
import { forSSRRouters } from './public/router/ssrRouters';
import renderer from './render';
import createStore from '../shared/redux/store';
import { determineUserLang } from '../common/i18n';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 靜態檔案處理
app.use(express.static(path.resolve(__dirname, '../../dist/client')));

app.get('*', async (req, res) => {
  const { path: reqPath, query } = req;

  // 1. 排除靜態檔案、副檔名請求
  if (reqPath.includes('.') || reqPath.startsWith('/.well-known')) {
    return res.status(404).send('Not Found');
  }

  try {
    const lang = determineUserLang(req.acceptsLanguages(), reqPath);
    const searchStr = queryString.stringify(query);

    // 2. 根目錄重導向 (例如 / -> /tw 或 /en)
    if (reqPath.trim() === '/') {
      const redirectUrl = `/${lang}${searchStr ? `?${searchStr}` : ''}`;
      return res.redirect(redirectUrl);
    }

    // 3. 獨立建立 Redux Store 避免跨請求汙染 (Request isolation)
    const store = createStore();
    const { dispatch } = store;

    // 4. 取得路由清單並進行匹配
    const routes = await forSSRRouters({});

    // 移除語系前綴取得純路徑來匹配路由 (例如 /tw/manage -> /manage)
    const cleanPath = reqPath.replace(new RegExp(`^/${lang}`), '') || '/';
    const matchedRoutes = matchRoutes(routes, cleanPath);
    
    // 開發期偵錯 Log
    console.log('--- [SSR DEBUG] ---');
    console.log('請求路徑 (reqPath):', reqPath);
    console.log('清理後路徑 (cleanPath):', cleanPath);
    console.log('匹配到的路由數量:', matchedRoutes.length);

    console.log('store 抓到的最新資料 (getState):', store.getState());
    console.log('---------------------');

    // 6. 資料都備齊後，才執行 SSR 渲染並傳遞 store 產生 HTML 回傳
    const content = await renderer(req, res, store);
    res.send(content);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.CLIENT_SERVER_PORT || 5001;
app.listen(port, () => {
  console.log(`Use run mode ===> ${process.env.NODE_MODE}`);
  console.log(`Client server listening on port ===> ${port}`);
});