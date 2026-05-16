import { io as createSocket, type Socket } from 'socket.io-client'

let socket: Socket | null = null

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:8080'

// autoConnect false: useMessageSocket controls lifecycle so we don't
// connect at import time before auth has resolved.
export function getSocket(): Socket {
  if (!socket) {
    socket = createSocket(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}
