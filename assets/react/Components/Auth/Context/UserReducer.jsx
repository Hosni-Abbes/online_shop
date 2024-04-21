const UserReducer = (state, action) => {
    switch (action.type) {

        case 'START_LOGIN':
            return {
                user: null,
                isLoading: true,
                error: false
            }

        case 'SUCCESS_LOGIN':
            return {
                user: action.payload,
                isLoading: false,
                error: false
            }

        case 'SUCCESS_REGISTER':
            return {
                user: null,
                isLoading: false,
                error: false
            }

        case 'FAIL_LOGIN':
            return {
                user: null,
                isLoading: false,
                error: action.payload
            }

        case "LOGOUT":
            return{
                user: null,
                isLoading: false,
                error: false
            };

        default: return state
    }
}

export default UserReducer;