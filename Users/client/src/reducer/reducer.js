import AuthService from "../utils/auth.service";

function reducer(state = {}, action) {
  let invitation = [];
  switch (action.type) {
    case 'user/updateUser':
      const user = AuthService.getCurrentUser();
      return { ...state, user };
    case 'invitation/add':
      if (!state.invitation) {
        invitation = [action.invitation];
      }
      else {
        invitation = [...state.invitation, action.invitation];
      }
      return { ...state, invitation };
    case 'invitation/remove':
      invitation = state.invitation.filter(function (item) {
        return item.ID !== Number(action.ID)
      })
      return { ...state, invitation }

    default:
      return state
  }
}
export default reducer
