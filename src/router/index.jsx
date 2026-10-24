import React from 'react';
import App from '../shared/App';
import { Layout as Home } from '../shared/pages/home';
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
                // loadData : HomeLoadData
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

/**
 * 將巢狀的 SPA 路由陣列壓平成一維陣列，供 SSR 的 matchRoutes 使用
 */
export const forSSRRouters = async () => {
  const flattenAndExtract = (routes, parentPath = '') => {
    let flatArray = [];

    routes.forEach((route) => {
      const { path = '', index = false, loadData, children, component, element } = route;

      if (path !== '/*') {
        let currentPath = parentPath;
        
        if (!index && path) {
          currentPath = `${parentPath}/${path}`.replace(/\/+/g, '/');
        } else if (!index && !parentPath) {
          currentPath = '/';
        }

        const targetComponent = component || element;

        // 如果當前節點有 loadData，我們同時把它註冊到「完整路徑」上
        if (targetComponent || loadData) {
          flatArray.push({
            path: currentPath || '/',
            ...(index ? { exact: true } : {}),
            ...(loadData ? { loadData } : {}),
            component: targetComponent
          });
        }

        // 遞迴處理子路由
        if (children && children.length > 0) {
          flatArray = flatArray.concat(flattenAndExtract(children, currentPath));
        }
      } else {
        if (children && children.length > 0) {
          flatArray = flatArray.concat(flattenAndExtract(children, parentPath));
        }
      }
    });

    return flatArray;
  };

  const spaRoutes = forSPARouters({});
  const rawRoutes = flattenAndExtract(spaRoutes);

  // 💡 智慧自動修正：遍歷所有產出的路由，
  // 找出「同一個 path」但一個有 loadData、一個沒 loadData 的情況，把它們合併！
  const routeMap = new Map();
  rawRoutes.forEach((route) => {
    const existing = routeMap.get(route.path);
    if (!existing) {
      routeMap.set(route.path, { ...route });
    } else {
      // 如果已經存在該路徑，把 loadData 或 component 補齊
      routeMap.set(route.path, {
        ...existing,
        loadData: existing.loadData || route.loadData,
        component: existing.component || route.component
      });
    }
  });

  const finalRoutes = Array.from(routeMap.values());
  
  // 印出最終自動產生的 SSR 路由清單，讓你能在終端機一眼看出有沒有抓到 loadData
  console.log('>>> 自動生成的 SSR 路由清單:', finalRoutes);

  return finalRoutes;
};