/*
 *   Copyright (c) 2021 
 *   All rights reserved.
 */

export default (
    state = {
        text: ""
    },action
) => {
    const { type="", payload="", list=[] } = action;
    switch( type ){
        case "HOME_TEST":
            state = { ...state, text: payload };
            break;
            
        default:
            break;
    }

    return state;
}