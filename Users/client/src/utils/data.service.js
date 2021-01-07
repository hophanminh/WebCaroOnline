import axios from "axios";
import HostURL from "./host.service"
const API_URL = HostURL.getHostURL();

const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
}

// user
const getUserInfo = () => {
  return axios.get(API_URL + "user/");
};

const changeUserInfo = (newUsername, newFullname, newEmail) => {
  return axios.post(API_URL + "user/changeinfo/", { newUsername, newFullname, newEmail });
};

const changePassword = (oldPass, newPass) => {
  return axios.post(API_URL + "user/changepass/", { oldPass, newPass });
}

const getOnlineRoomList = () => {
  return axios.get(API_URL + "room/online/");
};

const getFinishRoomList = (userID) => {
  return axios.post(API_URL + "user/finish/list", { userID });
};

const getFinishRoom = (roomID) => {
  return axios.post(API_URL + `user/finish/room`, { roomID });
};

const createRoom = () => {
  return axios.post(API_URL + "user/room/create/");
};

const joinRoomAsPlayer = (roomId) => {
  return axios.post(API_URL + "user/room/joinRequest/player", { roomId });
}

const joinRoomAsViewer = (roomId) => {
  return axios.post(API_URL + "user/room/joinRequest/viewer", { roomId });
}

const activeAccount = (hashLink) => {
  return axios.post(API_URL + `activeAccount/${hashLink}`);
}

const forgotPass = (email) => {
  return axios.post(API_URL + `forgotPass/`, {email});
}

const resetPassword = (uuid, newPassword) => {
  return axios.post(API_URL + `resetPassword/${uuid}`, {newPassword});
}

const getMessage = (roomID) => {
  return axios.post(API_URL + `user/finish/message`, { roomID });
};

const getUsers = () => {
  return axios.get(API_URL + `user/ranking`);
}

const getUserByUsernameOrEmail = (target) => {
  return axios.post(API_URL + `user/search`, { target })
}

const getUserByUserId = (ID) => {
  return axios.get(API_URL + `user/${ID}`);
}

const DataService = {
  getUserInfo,
  changeUserInfo,
  changePassword,
  getOnlineRoomList,
  getFinishRoomList,
  getFinishRoom,
  createRoom,
  joinRoomAsPlayer,
  joinRoomAsViewer,
  activeAccount,
  forgotPass,
  resetPassword,
  getMessage,
  getUsers,
  getUserByUsernameOrEmail,
  getUserByUserId,

}

export default DataService;
