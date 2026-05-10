import { io as createSocket, type Socket } from 'socket.io-client'

// Singleton — one socket.io connection per tab, lazily created on first
// access. We keep it module-scoped (rather than re-creating per hook
// mount) so multiple components can share the same connection and so
// reconnect/auth state isn't reset every time a consumer mounts.
let socket: Socket | null = null

// In dev the backend runs at :8080 and the Next dev server proxies HTTP
// to it via next.config.ts. WebSockets aren't proxied, so the client
// connects directly. In production the backend has its own URL and is
// supplied via NEXT_PUBLIC_SOCKET_URL.
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:8080'

// withCredentials: true sends the accessToken cookie with the cross-origin
// handshake (matching the backend's cookie-based JWT auth).
// autoConnect: false hands lifecycle control to useMessageSocket — we
// don't want to connect at module import time, before auth has resolved.
// transports tries websocket first; falls back to long-polling only if
// the upgrade fails (rare in modern browsers/environments).
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
