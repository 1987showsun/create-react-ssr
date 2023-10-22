import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import { FormattedMessage } from 'react-intl';

// loadDate
import loadData from './loadData';

const Home = ({ 

}) => {

  const dispatch = useDispatch();
  const { text } = useSelector(state => state.home);

  useEffect(() => {
    (async() => {
      await loadData({ dispatch })
    })()
  }, []);

  return(
    <>
      <Helmet>
          <title>home</title>
      </Helmet>
      <h1>
        <FormattedMessage id="home.test" />
      </h1>
      <div>home</div>
      <div>{text}</div>
    </>
  );
}

Home.loadDate = async({
  dispatch
}) => {
  console.log('123123131231231231231231');
  return null;
}

export default Home;