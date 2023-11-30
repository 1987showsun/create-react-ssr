import { testManagAction } from '../../../redux/actions/manage';

export default async({
    dispatch
}) => {
    console.log('3234123123r123')
   const res = await dispatch( testManagAction({}) )
    return res;
}