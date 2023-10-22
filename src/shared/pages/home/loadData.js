export default async({
    dispatch
}) => {
    await dispatch({
        type: "HOME_TEST",
        payload: "home test"
    })
    return null;
}