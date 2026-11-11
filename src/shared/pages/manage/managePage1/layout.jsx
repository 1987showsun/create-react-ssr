import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link, useBeforeUnload } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';

// Actions
import { GetManageUser, testManagAction } from '../../../redux/actions/manage';

import axios from '../../../hooks/axios'; // 你的 axios

const fetchManageUser = async () => {
    const res = await axios.get('https://randomuser.me/api/');
    return res.data.results[0].email;
};

// 💡 匯出共用的 loadServerData，供 Server 端與 Client 端共用
export const loadServerData = {
    queryKey : ['manageUser'],
    queryFn  : fetchManageUser,
};

export default ({

}) => {

    const dispatch = useDispatch();

    const { data: text, isLoading } = useQuery(loadServerData);

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