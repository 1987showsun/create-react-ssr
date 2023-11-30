import App from '../shared/App';
import { Layout as Home, loadData as HomeLoadData } from '../shared/pages/home';
import { Layout as Manage } from '../shared/pages/manage';
import { Layout as ManagePage1, loadData as ManageDashboardLoadData } from '../shared/pages/manage/managePage1';

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
                        loadData : ManageDashboardLoadData
                    }
                ]
            }
        ]
    }
];

export const forSSRRouters = async({

}) => {

    const flat = () => {
        const flatArray = [];
        return (three, parentPath=null) => {
          
          if( Array.isArray(three) ){
            flatten(three[0]);
          }else{
            
            const {
              path = '',
              index = false,
              element = null,
              loadData = null
            } = three;
            
            if( path!='/*' && element && parentPath ){
               flatArray.push({
                  name: three.name,
                  ...index? { exact: true }:null,
                  ...loadData? {loadData: loadData}:null,
                 path: `${parentPath}${index? '':`/${path}`}`,
                 component: element
               });
            }else if(path!='/*'){
              parentPath = `${parentPath? parentPath:''}/${path}`;
            }
            
            if( three.hasOwnProperty('children') &&  three.children.length>0 ){    
              const { children=[] } = three;
              children.forEach(item => {
                flatten(item, parentPath);
              })
            }
          }
      
          return flatArray ;
        }
      }
      
      const flatten = flat();
      const readjust = flatten(forSPARouters({}));
      return readjust;
}