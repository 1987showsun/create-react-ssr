import React, { Suspense } from 'react';
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
    <Provider store={createStore}>
      <BrowserRouter basename={`/${lang}`}>
        <Suspense fallback={<span>Loading...</span>}>
          <App1 lang={lang} />
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<Index />);