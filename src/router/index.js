import App from '../shared/App';
import { Layout as Home, loadData as HomeLoadData } from '../shared/pages/home';
import { Layout as Manage } from '../shared/pages/manage';
import { Layout as ManagePage1 } from '../shared/pages/manage/managePage1';

export const forSPARouters = ({
    lang     = "",
    search   = "",
    location = ""
}) => [
    {
        path: "/*",
        element: <App lang={lang} SSRPath={location} SSRSearch={search}/>,
        component: App,
        children: [
            {
                index: true,
                element: <Home/>,
                component: Home,
                loadData : HomeLoadData
            },
            {
                path: "manage",
                element: <Manage />,
                component: Manage,
                children: [
                    {
                        index    : true,
                        element  : <ManagePage1/>,
                        component: ManagePage1,
                        // loadData : ManageDashboardLoadData
                    }
                ]
            }
        ]
    }
];

export const forSSRRouters = async({

}) => {
    let routesFlat     = [];

    const objectToFlat = async( item ) => {
        const { path: parentPath } = item;
        if( item.children && item.children.length>0 ){
            if( Array.isArray(item.children) ){
                item.children.forEach( subItem => {
                    const { path: subPath } = subItem;
                    if( !(/^(\/\*)/).test(parentPath) ){
                        const checkForBackslashes = ( parentPath, subPath ) => {
                            if( (/\/$/).test(parentPath) ){
                                return `${parentPath}${subPath}`;
                            }
                            return `${parentPath}/${subPath}`;
                        }
                        subItem = { ...subItem, path: !subItem.index? checkForBackslashes(parentPath, subPath):`${parentPath}` };
                    }else{
                        subItem = { ...subItem, path: !subItem.index?`/${subPath}`:`/` }
                    }
                    objectToFlat( subItem );
                });
            }
        }

        const checkIsIndexPromise = new Promise(( resolve, reject ) => {
            if( item.index ){
                item = { ...item, exact: true };
            }
            resolve(item); 
        });
        await checkIsIndexPromise;
        routesFlat.push(item);
        return routesFlat;
    }

    await forSPARouters({}).forEach( async(item) => {
        await objectToFlat( item );
    });
    const readjust = routesFlat.map(item => {
        if( item.path=="/*" ){
            item = { ...item, path: '/' };
        }
        delete item.children;
        delete item.index;
        return item;
    });

    return readjust;
}