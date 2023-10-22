require("dotenv").config();
import React, { Suspense } from 'react';
import { renderToString }     from 'react-dom/server';
import { useRoutes }          from 'react-router-dom';
import { StaticRouter }       from 'react-router-dom/server';
import { Provider }           from 'react-redux';
import { Helmet }             from 'react-helmet';
import serialize              from 'serialize-javascript';

import { determineUserLang }  from '../common/i18n';
import { forSPARouters }      from '../router';

const App = ({ lang, search, location }) => useRoutes(forSPARouters({lang, search, location }));

export default (req, store) => {
  const { path, query } = req;
  const context = {};
  const initialData = store.getState();
  const lang = determineUserLang(req.acceptsLanguages(), path);
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter 
        context  = {context}
        location = {path} 
        basename = {`/${lang}`}
      >
        <Suspense fallback={<span>Loading...</span>}>
          <App 
            lang     = {lang} 
            search   = {query}
            location = {path}
          />
        </Suspense>
      </StaticRouter>
    </Provider>,
  );

  const helmet = Helmet.renderStatic();
  const helmetToString = Object.keys(helmet)
    .filter((key) => helmet[key].toString() !== '')
    .map((item) => helmet[item].toString());

  return (`
    <html>
      <head>
        ${helmetToString.join('\n')}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no,email=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" type="text/css" href="../../../../css/main.css" />
      </head>
      <body>
        <div id="root">${content}</div>
        <script defer src="/main.js"></script>
        <script>window.__initialData__ = ${serialize(initialData)}</script>
        <script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>
      </body>
    </html>
  `);
};
