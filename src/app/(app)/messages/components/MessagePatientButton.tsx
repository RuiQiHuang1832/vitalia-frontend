'use client'

import { Button } from '@/components/ui/button'
import { useStartConversation } from '@/hooks/useStartConversation'
import { MessageSquare } from 'lucide-react'

type Props = {
  // The patient's *user* id (PatientBase.userId), not the patient row id.
  // Conversations are keyed on User. When userId is null the patient has
  // no linked account and can't be messaged — the parent should not render
  // this component in that case.
  userId: number
  label?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

// Default size mirrors the shadcn Button default — callers pick `sm` when
// they need to match smaller controls (e.g. the Manage dropdown on the
// appointment details page).

// Provider-only CTA used on the patient detail page and appointments page
// to jump straight into a conversation with the patient. Re-uses the
// idempotent POST /conversations endpoint, so clicking it twice doesn't
// create duplicate threads.
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
