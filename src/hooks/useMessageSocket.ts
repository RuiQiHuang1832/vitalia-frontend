import { useAuthStore } from '@/app/(auth)/stores/auth.store'
import { getSocket } from '@/lib/socket'
import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'

export function useMessageSocket(): { socket: Socket; connected: boolean } {
  const status = useAuthStore((s) => s.status)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Wait for auth so the handshake doesn't race cookie hydration.
    if (status !== 'authenticated') return

    const socket = getSocket()

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onError = (err: Error) => {
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
