import AuthService from "../utils/auth.service";

function updateUserReducer(state, action) {
    switch (action.type) {
        case 'user/updateUser':
            const user = AuthService.getCurrentUser();
            return user;
        default:
            return state
    }
}
export default updateUserReducer
