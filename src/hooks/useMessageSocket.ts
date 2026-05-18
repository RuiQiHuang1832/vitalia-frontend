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
    let cancelled = false

    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    const onError = (err: Error) => {
      console.error('Socket connect error:', err.message)
      setConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onError)

    // The accessToken cookie lives on the frontend origin (set via the
    // /api proxy), so the backend socket — which is a different origin —
    // can't read it from the handshake. Fetch it same-origin and pass it
    // through socket.io's auth field instead.
    ;(async () => {
      try {
        const res = await fetch('/socket-token', { credentials: 'include' })
        if (!res.ok) throw new Error(`socket-token responded ${res.status}`)
        const { token } = (await res.json()) as { token: string }
        if (cancelled) return
        socket.auth = { token }
        if (!socket.connected) socket.connect()
      } catch (err) {
        console.error('Socket auth setup failed:', err)
      }
    })()

    return () => {
      cancelled = true
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onError)
      socket.disconnect()
      setConnected(false)
    }
  }, [status])

  return { socket: getSocket(), connected }
}
