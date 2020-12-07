import socketIOClient from "socket.io-client";

// test
const API_URL = "http://localhost:9000/";

// connect to server
const socket = socketIOClient(API_URL);

export default socket;