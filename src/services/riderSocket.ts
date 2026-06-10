import { io, type Socket } from "socket.io-client";
import { SOCKET_PATH, getSocketBaseUrl } from "./api/config";
import { readRiderBackendAccessToken } from "./api/authApi";

export type RiderSocket = Socket;

export function createRiderSocket(): RiderSocket {
  const socketBaseUrl = getSocketBaseUrl();
  return io(`${socketBaseUrl}/rider`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readRiderBackendAccessToken(),
    },
  });
}
