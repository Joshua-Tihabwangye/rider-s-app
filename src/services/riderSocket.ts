import { io, type Socket } from "socket.io-client";
import { SOCKET_BASE_URL, SOCKET_PATH } from "./api/config";
import { readRiderBackendAccessToken } from "./api/authApi";

export type RiderSocket = Socket;

export function createRiderSocket(): RiderSocket {
  return io(`${SOCKET_BASE_URL}/rider`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readRiderBackendAccessToken(),
    },
  });
}
