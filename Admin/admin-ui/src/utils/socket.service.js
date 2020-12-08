import socketIOClient from "socket.io-client";
import HostURL from "./host.service"
const API_URL = HostURL.getHostURL();

// connect to server
const socket = socketIOClient(API_URL);

export default socket;