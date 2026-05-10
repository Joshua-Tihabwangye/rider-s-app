import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "./api/config";
import { readRiderBackendAccessToken } from "./api/authApi";

export type RiderSocket = Socket;

export function createRiderSocket(): RiderSocket {
  return io(`${API_BASE_URL}/rider`, {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readRiderBackendAccessToken(),
    },
  });
}
