import { testManagAction } from '../../../redux/actions/manage';

export default async({
    dispatch
}) => {
    const res = await dispatch( testManagAction({}) )
    return res;
}