import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

const Home = ({ 

}) => {

  const dispatch = useDispatch();
  const { text } = useSelector(state => state.home);

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
      <Link to="/manage">manage</Link>
    </>
  );
}

export default Home;