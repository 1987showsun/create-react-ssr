import { forSPARouters } from '../../../router/index';

export const forSSRRouters = async () => {
    const flattenAndExtract = (routes, parentPath = '') => {
        let flatArray = [];

        routes.forEach((route) => {
        const { path = '', index = false, loadServerData, children, component, element } = route;

        if (path !== '/*') {
            let currentPath = parentPath;
            
            if (!index && path) {
            currentPath = `${parentPath}/${path}`.replace(/\/+/g, '/');
            } else if (!index && !parentPath) {
            currentPath = '/';
            }

            const targetComponent = component || element;

            if (targetComponent || loadServerData) {
            flatArray.push({
                path: currentPath || '/',
                ...(index ? { exact: true } : {}),
                ...(loadServerData ? { loadServerData } : {}),
                component: targetComponent
            });
            }

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

    const routeMap = new Map();
    rawRoutes.forEach((route) => {
        const existing = routeMap.get(route.path);
        if (!existing) {
        routeMap.set(route.path, { ...route });
        } else {
        routeMap.set(route.path, {
            ...existing,
            component: existing.component || route.component,
            loadServerData: existing.loadServerData || route.loadServerData
        });
        }
    });

    const finalRoutes = Array.from(routeMap.values());
    
    console.log('>>> 自動生成的 SSR 路由清單:', finalRoutes);

    return finalRoutes;
};