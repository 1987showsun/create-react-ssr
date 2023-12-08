import React, { Suspense } from 'react';
import ReactDom, { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

const queryClient = new QueryClient();

const App1 = ({ lang }) => { 
  return useRoutes(forSPARouters({lang}));
};

function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={createStore}>
        <BrowserRouter basename={`/${lang}`}>
          <App1 lang={lang} />
        </BrowserRouter>
      </Provider>
      <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV === 'development'} />
    </QueryClientProvider>
  );
}

// const root = ReactDom.createRoot(document.getElementById('root'));
// root.render(<Index />);

// ReactDom.hydrateRoot(document.getElementById('root'), <Index />);
hydrateRoot(document.getElementById('root'), <Index />);