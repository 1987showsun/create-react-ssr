import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useBeforeUnload } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Actions
import { GetManageUser, testManagAction } from '../../../redux/actions/manage';

export default ({

}) => {

    const dispatch = useDispatch();
    const { text } = useSelector(state => state.manage);

    useEffect(() => {
        (async() => {
            // await dispatch( GetManageUser({}) );
            await dispatch( testManagAction({}) );
        })();
    }, [])

    return(
        <>
            <Helmet>
                <title>manage</title>
            </Helmet>
            <div>manage page1 : {text}</div>
            <Link to="/">home</Link>
        </>
    );
}