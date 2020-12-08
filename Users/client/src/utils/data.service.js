import axios from "axios";
import HostManagement from "./host.service"

// test
const API_URL = HostManagement.getHost;

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


// detail board
const DataService = {
  getUserInfo,
  changeUserInfo,
  changePassword,
}

export default DataService;
