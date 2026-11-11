import { lazy } from "react";
import { loadServerData } from './layout';

const Layout = lazy(() => import('./layout'));

export {
    Layout,
    loadServerData
}