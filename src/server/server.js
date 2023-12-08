require("dotenv").config();
import favicon from 'serve-favicon';
import express from 'express';
import queryString from 'query-string';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { matchRoutes   } from 'react-router-config';
import { forSSRRouters } from '../router';
import renderer from './render';
import store from '../shared/redux/store';
import { determineUserLang } from '../common/i18n';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.static('dist'));
app.set('view engine', 'ejs');
app.set('/server/views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, './dist/assets/images', 'favicon.ico')));

app.get('*', async(req, res) => {
  const { path, query } = req;
  const { dispatch } = store;
  const lang = determineUserLang(req.acceptsLanguages(), path);
  const routes = matchRoutes(await forSSRRouters({}), path.replace(`/${lang}`, ''));
  // eslint-disable-next-line arrow-body-style
  const promises = routes.map(({ route }) => {
    return route.loadData !== undefined ? route.loadData({ dispatch, pathname: path, search: queryString.stringify(query) }) : null;
  });

  const sarech = queryString.stringify(query);
  if (path.trim() === '/') {
    res.redirect(`${lang}${sarech.trim()!==''? `?${sarech}`:''}`);
  } else {
    await Promise.all(promises);
    const content = await renderer(req, res, store);
    res.send(content);
  }
});

const port = process.env.CLIENT_SERVER_PORT || 5001;
app.listen(port, () => {
  console.log(`Use run mode ===> ${process.env.NODE_MODE}`)
  console.log(`Clinet server listening on port ===> ${port}`);
});