import axios from "axios";

const API_URL = "http://localhost:9000/";

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


// detail board
const DataService = {
    getUserInfo,
    changeUserInfo,
    changePassword,
}

export default DataService;
