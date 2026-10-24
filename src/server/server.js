require("dotenv").config();
import express from 'express';
import queryString from 'query-string';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { matchRoutes } from 'react-router-config';
import { forSSRRouters } from '../router';
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

    // 2. 根目錄重導向
    if (reqPath.trim() === '/') {
      const redirectUrl = `/${lang}${searchStr ? `?${searchStr}` : ''}`;
      return res.redirect(redirectUrl);
    }

    // 3. 獨立建立 Redux Store 避免跨請求汙染
    const store = createStore();
    const { dispatch } = store;

    // 4. 取得路由清單
    const routes = await forSSRRouters({});

    // 💡 關鍵修正：直接拿完整的 reqPath 去匹配路由（保留語言前綴或讓路由解析器吃完整的路徑）
    // 如果你的路由帶有 /en 或 /tw 這種語系前綴，直接用 reqPath 匹配最準確
    const cleanPath = reqPath.replace(new RegExp(`^/${lang}`), '') || '/';
    const matchedRoutes = matchRoutes(routes, cleanPath);
    
    // 💡 加上這幾行來檢查
    console.log('--- [SSR DEBUG] ---');
    console.log('請求路徑 (reqPath):', reqPath);
    console.log('清理後路徑 (cleanPath):', cleanPath);
    console.log('匹配到的路由數量:', matchedRoutes.length);
    matchedRoutes.forEach((item, index) => {
      console.log(`路由 #${index}:`, item.route.path, '是否有 loadData:', !!item.route.loadData);
    });

    // 5. 確保確實等待所有 loadData 執行完畢
    const promises = matchedRoutes.map(({ route, match }) => {
      if (route.loadData) {
        console.log(`正在執行 ${route.path} 的 loadData...`);
        return route.loadData({ dispatch, pathname: reqPath, search: searchStr, match })
          .catch(err => {
            console.error(`❌ loadData 執行失敗 (${route.path}):`, err.message);
            return null; // 避免單個 API 失敗導致整個 SSR 崩潰
          });
      }
      return null;
    });

    await Promise.all(promises);

    console.log('store 抓到的最新資料 (getState):', store.getState());
    console.log('---------------------');

    // 6. 資料都備齊後，才執行 SSR 渲染回傳 HTML
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