'use client'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Copy, KeyRound } from 'lucide-react'

export function LoginCredentialsPopover() {
  const accounts = [
    { role: 'Admin', email: 'admin@gmail.com', pass: 'admin123' },
    { role: 'Provider', email: 'provider@gmail.com', pass: 'admin123' },
    { role: 'Patient', email: 'patient@gmail.com', pass: 'admin123' },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <KeyRound className="mr-2 h-4 w-4" />
          Test Accounts
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Demo Credentials</h4>{' '}
            <p className="text-sm text-muted-foreground">
              Click an email to copy it to your clipboard.
            </p>
          </div>
          <div className="grid gap-3">
            {accounts.map((acc) => (
              <div
                key={acc.role}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div className="grid gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    {acc.role}
                  </span>
                  <span className="text-sm font-mono italic">{acc.email}</span>
                  <span className="text-xs text-muted-foreground">Pass: {acc.pass}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(acc.email)}
                  title="Copy email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
