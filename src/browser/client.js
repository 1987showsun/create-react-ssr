import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import ReactDom from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';

// i18n Language
import { determineUserLang }        from '../common/i18n';

// Redux store setup
import createStore                  from '../shared/redux/store';

// Router Setup
import { forSPARouters }            from '../router';

const lang = determineUserLang(
  navigator.languages || [],
  window.location.pathname,
);

const App1 = ({ lang }) => { 
  return useRoutes(forSPARouters({lang}));
};

function Index() {
  return (
    <Suspense fallback={<span>Loading...</span>}>
      <Provider store={createStore()}>
        <BrowserRouter basename={`/${lang}`}>
          <App1 lang={lang} />
        </BrowserRouter>
      </Provider>
    </Suspense>
  );
}

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<Index />);