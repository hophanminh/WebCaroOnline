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

const getOnlineRoom = () => {
  return axios.get(API_URL + "room/online/");
};

const createRoom = () => {
  return axios.post(API_URL + "user/room/create/");
};

const joinRoomAsPlayer = (roomId) => {
  return axios.post(API_URL + "user/room/joinRequest/player", {roomId});
}

const joinRoomAsViewer = (roomId) => {
  return axios.post(API_URL + "user/room/joinRequest/viewer", {roomId});
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

const DataService = {
  getUserInfo,
  changeUserInfo,
  changePassword,
  getOnlineRoom,
  createRoom,
  joinRoomAsPlayer,
  joinRoomAsViewer,
  activeAccount,
  forgotPass,
  resetPassword
}

export default DataService;
