import { lazy } from 'react';

const Layout = lazy(() => import('./layout'));
import loadData from './loadData';

export {
    Layout,
    loadData
}