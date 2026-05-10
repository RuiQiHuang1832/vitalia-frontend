import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { getSocket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'

// Manages the connection lifecycle for the messaging socket. Call this
// once in the page that needs realtime updates (MessagesClient). It:
//   - waits for auth to resolve as authenticated before connecting
//     (otherwise the handshake would race the cookie hydration)
//   - tracks `connected` state so the UI can show indicators if needed
//   - disconnects on unmount, so navigating away from /messages closes
//     the websocket cleanly. Reconnect happens on the next mount.
//
// Listener attachment (socket.on('message:new', ...)) is intentionally
// NOT done here — it lives in the components that consume each event
// type (sub-step 5), so this hook stays purely about lifecycle.
export function useMessageSocket(): { socket: Socket; connected: boolean } {
  const status = useAuthStore((s) => s.status)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return

    const socket = getSocket()

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onError = (err: Error) => {
      // connect_error fires when handshake auth fails or the server is
      // unreachable. We log + flip connected false; the UI just stays
      // in its "no realtime" mode until reconnect succeeds.
      console.error('Socket connect error:', err.message)
      setConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onError)

    if (!socket.connected) socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onError)
      socket.disconnect()
      setConnected(false)
    }
  }, [status])

  return { socket: getSocket(), connected }
}
