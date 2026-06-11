import { io, type Socket } from "socket.io-client";
import { SOCKET_PATH, getSocketBaseUrl } from "./api/config";
import { readRiderBackendAccessToken } from "./api/authApi";

export type RiderSocket = Socket;

// singleton socket, same pattern as the driver app.
// createRiderSocket() now returns the same instance on every call
// and refreshes the auth token without re-creating the connection.
let riderSocket: RiderSocket | null = null;

export function createRiderSocket(): RiderSocket {
  if (!riderSocket) {
    riderSocket = io(`${getSocketBaseUrl()}/rider`, {
      path: SOCKET_PATH,
      transports: ["websocket"],
      autoConnect: false,
      withCredentials: false,
      auth: {
        token: readRiderBackendAccessToken(),
      },
    });
  }

  // Refresh the auth token on every call so reconnects pick up a fresh JWT.
  riderSocket.auth = {
    token: readRiderBackendAccessToken(),
  };

  return riderSocket;
}
