import socketIOClient from "socket.io-client";
import HostManagement from "./host.service"

// test
const API_URL = HostManagement.getHost;

// connect to server
const socket = socketIOClient(API_URL);

export default socket;