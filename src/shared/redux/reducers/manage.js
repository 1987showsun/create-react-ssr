export default (
    state = {
        text: ""
    },action
) => {
    const { type="", payload="", list=[] } = action;
    switch (type) {
        case "MANAGE_TEST":
            // 直接回傳新物件，避免直接操作 state
            return { 
                ...state, 
                text: payload 
            };
            
        default:
            return state; // 預設直接回傳原本的 state
    }
}