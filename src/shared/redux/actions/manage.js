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

export const testManagAction = ({ data=null, params=null }) => {
    return async(dispatch) => {
        try {
            console.log('>>> 正在伺服器端發送 API 請求...');

            const res = await axios({
                method: "get", // post / put / delete
                url   : `https://randomuser.me/api/`,
                ...data   && {data  : {}},
                ...params && {params: {}},
            });

            console.log('>>> API 回傳結果:', res.data);

            // 確保 results 是陣列，並正確取得第一個使用者的 email
            const results = res.data && res.data.results ? res.data.results : [];
            const email = results.length > 0 ? results[0].email : '';

            dispatch({
                type: 'MANAGE_TEST',
                payload: email
            });

            // 務必回傳資料或 res，讓上層的 loadData 能正確 await
            return email;
        }catch (error) {
            console.error(">>> SSR API 請求失敗錯誤:", error);
            return null;
        }
    };
}   