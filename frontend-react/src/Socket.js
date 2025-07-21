import {io} from 'socket.io-client';

const socket=io("https://backend-service-wdgk.onrender.com");
export default socket;