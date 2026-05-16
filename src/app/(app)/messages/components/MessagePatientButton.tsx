'use client'

import { Button } from '@/components/ui/button'
import { useStartConversation } from '@/hooks/useStartConversation'
import { MessageSquare } from 'lucide-react'

type Props = {
  // The User id, not the Patient row id. Conversations are keyed on User.
  userId: number
  label?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export default function MessagePatientButton({
  userId,
  label = 'Message Patient',
  variant = 'outline',
  size,
  className,
}: Props) {
  const { startConversation, busy } = useStartConversation()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={busy}
      onClick={() => startConversation(userId)}
    >
      <MessageSquare className="size-4" />
      {label}
    </Button>
  )
}
