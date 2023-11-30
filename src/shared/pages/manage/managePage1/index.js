import { lazy } from "react";
import loadData from './loadData';

const Layout = lazy(() => import('./layout'));

export {
    Layout,
    loadData
}