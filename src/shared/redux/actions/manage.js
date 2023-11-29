import axios from '../../hooks/axios';

export const GetManageUser = ({  }) => {
    return async(dispatch) => {
        const res = axios({
            method: "get", // post / put / delete
            url   : `/apipath`,
            data  : {},
            params: {},
        });

        // return res;
    };
}   