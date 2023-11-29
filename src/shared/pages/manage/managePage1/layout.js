import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useBeforeUnload } from "react-router-dom";
import { useDispatch } from "react-redux";

// Actions
import { GetManageUser } from '../../../redux/actions/manage';

export default ({

}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        (async() => {
            await dispatch( GetManageUser({}) );
        })();
    })

    return(
        <>
            <Helmet>
                <title>manage</title>
            </Helmet>
            <div>manage page1</div>
            <Link to="/">home</Link>
        </>
    );
}