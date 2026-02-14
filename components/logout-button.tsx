"use client"

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const onLogout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={onLogout}
      className='rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition'
    >
      Sign out
    </button>
  )
}
