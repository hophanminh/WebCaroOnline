import axios from "axios";
import HostURL from "./host.service"
const API_URL = HostURL.getHostURL();

const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
}

const getUserInfo = () => {
    return axios.get(API_URL + "admin/");
};

const changeUserInfo = (newUsername, newFullname, newEmail) => {
    return axios.post(API_URL + "admin/updateInformation/", { newUsername, newFullname, newEmail });
};

const changePassword = (oldPass, newPass) => {
    return axios.post(API_URL + "admin/updatePassword/", { oldPass, newPass });
}

const getUsers = () => {
    return axios.get(API_URL + "admin/users");
}

const getSpecificUser = (search) => {
    return axios.post(API_URL + "admin/search", {search})
}


// detail board
const DataService = {
    getUserInfo,
    changeUserInfo,
    changePassword,
    getUsers,
    getSpecificUser,
}

export default DataService;
