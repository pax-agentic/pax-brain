"use client"

import { GoogleLogo } from '@phosphor-icons/react'
import { useState } from 'react'

export function LoginGoogleButton({ hasOAuthError }: { hasOAuthError: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          callbackURL: '/',
          disableRedirect: true,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.url) {
        throw new Error(data?.message || 'Failed to start Google sign-in')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      setLoading(false)
    }
  }

  return (
    <>
      {hasOAuthError && (
        <p className='mt-4 rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
          Access denied. This Google account is not authorized for Pax Brain.
        </p>
      )}

      {error && (
        <p className='mt-4 rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
          {error}
        </p>
      )}

      <button
        onClick={onGoogleSignIn}
        disabled={loading}
        className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-500/20 py-2 font-medium hover:bg-cyan-500/30 disabled:opacity-60'
      >
        <GoogleLogo size={18} weight='duotone' />
        {loading ? 'Redirecting…' : 'Sign in with Google'}
      </button>
    </>
  )
}
