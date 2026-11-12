import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useBeforeUnload } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';

// Actions
import { fetchManageData } from '../../../redux/actions/manage';

// Apis
import { getManageApi } from '../../../api/manage';


// 💡 匯出共用的 loadServerData，供 Server 端與 Client 端共用
export const loadServerData = {
    queryKey : ['manageUser'],
    queryFn  : getManageApi,
    select   : (serverData) => {
        return serverData.results[0].email;
    }
};

export default ({

}) => {

    const dispatch = useDispatch();

    const { data: text, isLoading } = useQuery(loadServerData);

    useEffect(() => {
        dispatch(fetchManageData());
    }, []);

    return(
        <>
            <Helmet>
                <title>manage</title>
                <meta name="description" content="Helmet application" />
            </Helmet>
            <div>manage page : {isLoading ? 'Loading...' : text}</div>
            <Link to="/">home</Link>
        </>
    );
}