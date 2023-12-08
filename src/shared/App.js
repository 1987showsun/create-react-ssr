/* eslint-disable react/prop-types */
import { Suspense, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ToastContainer } from 'react-toastify';


// i18n all local language
import { defaultLang }  from '../common/i18n';
import messages         from '../common/i18n/messages';

// Stylesheets
import './public/stylesheets/style.scss';

const App = ({ 
  lang       = '',
  SSRPath    = '',
  SSRSearch  = {}
}) => {

  const { pathname } = useLocation();
  const [ stateLang, setLang ] = useState(lang);

  useEffect(() => setLang(lang), [lang]);

  return (
    <IntlProvider
      locale        = "en"
      key           = "en"
      messages      = { messages[lang] }
      defaultLocale = { defaultLang }
    >
      <Suspense fallback={<span>Loading...</span>}>
        <Outlet />
      </Suspense>
      <ToastContainer 
        autoClose   = {5000}
        newestOnTop = {true}
        position    = {'bottom-right'}
        theme       = "dark" 
      />
      <select
        value    = {stateLang}
        onChange = {(e) => setLang(e.target.value)}
      >
        <option value="en">en</option>
        <option value="tw">tw</option>
      </select>
    </IntlProvider>
  );
}

export default App;
