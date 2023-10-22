require("dotenv").config();
import express from 'express';
import queryString from 'query-string';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { matchRoutes   } from 'react-router-config';
import { forSSRRouters } from '../router';
import renderer from './render';
import createStore from '../shared/redux/store';
import { determineUserLang, supportedLangs, defaultLang } from '../common/i18n';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.static('dist'));
app.set('view engine', 'ejs');
app.set('/server/views', path.join(__dirname, 'views'));

app.get('*', async(req, res) => {
  const { path, query } = req;
  const store = createStore();
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
    Promise.all(promises).then(() => {
      const content = renderer(req, store);
      res.send(content);
    });
  }
});

const port = process.env.CLINET_PORT || 5001;
// const port = 5001;
app.listen(port, () => {
  console.log(`Clinet server listening on port: ${port}`);
});
