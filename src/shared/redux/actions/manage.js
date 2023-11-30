import axios from '../../hooks/axios';

export const GetManageUser = ({  }) => {
    return async(dispatch) => {
        // const res = axios({
        //     method: "get", // post / put / delete
        //     url   : `/apipath`,
        //     data  : {},
        //     params: {},
        // });

        // return res;
    };
}   

export const testManagAction = ({  }) => {
    return async(dispatch) => {
        
        const res = await axios({
            method: "get", // post / put / delete
            url   : `https://randomuser.me/api/`,
            data  : {},
            params: {},
        });

        const {
            data: {
                results= {}
            }
        } = res;

        dispatch({
            type: 'MANAGE_TEST',
            payload: results[0].email
        })

        return;
    };
}   