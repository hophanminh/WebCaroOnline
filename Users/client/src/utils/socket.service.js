import socketIOClient from "socket.io-client";

// test
const API_URL = "http://localhost:9000/";
//const API_URL = "https://midterm596server.herokuapp.com/";

// connect to server
const socket = socketIOClient(API_URL);

export default socket;