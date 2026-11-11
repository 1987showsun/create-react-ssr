import React from 'react';
import App from '../shared/App';
import { Layout as Home } from '../shared/pages/home';
import { Layout as Manage } from '../shared/pages/manage';
import { Layout as ManagePage1, loadServerData } from '../shared/pages/manage/managePage1';

export const forSPARouters = ({
    lang     = "",
    search   = "",
    location = ""
}) => [
    {
        path       : "/*",
        element    : <App lang={lang} SSRPath={location} SSRSearch={search}/>,
        component  : App,
        children   : [
            {
                index     : true,
                element   : <Home/>,
                component : Home,
            },
            {
                path      : "manage",
                element   : <Manage />,
                component : Manage,
                children  : [
                    {
                        index          : true,
                        element        : <ManagePage1/>,
                        component      : ManagePage1,
                        loadServerData : loadServerData,
                    }
                ]
            }
        ]
    }
];