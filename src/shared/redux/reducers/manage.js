export default (
    state = {
        text: ""
    },action
) => {
    const { type="", payload="", list=[] } = action;
    switch( type ){
        case "MANAGE_TEST":
            state = { ...state, text: payload };
            break;

            
        default:
            break;
    }

    return state;
}