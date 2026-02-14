"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const signUpRes = await fetch('/api/auth/sign-up/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `${username}@brain.local`,
            password,
            name: username,
            username,
            displayUsername: username,
          }),
        })

        if (!signUpRes.ok) {
          const data = await signUpRes.json().catch(() => ({}))
          throw new Error(data?.message || 'Failed to create account')
        }
      }

      const signInRes = await fetch('/api/auth/sign-in/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe: remember }),
      })

      if (!signInRes.ok) {
        const data = await signInRes.json().catch(() => ({}))
        throw new Error(data?.message || 'Invalid credentials')
      }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6'>
      <div className='w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl'>
        <h1 className='text-2xl font-semibold'>Pax Brain Access</h1>
        <p className='mt-2 text-sm text-slate-300'>Sign in with your username and password.</p>

        <div className='mt-4 flex gap-2'>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${mode === 'signin' ? 'bg-cyan-500/20 border border-cyan-300/30' : 'bg-white/5 border border-white/10'}`}
            onClick={() => setMode('signin')}
            type='button'
          >
            Sign in
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm ${mode === 'signup' ? 'bg-violet-500/20 border border-violet-300/30' : 'bg-white/5 border border-white/10'}`}
            onClick={() => setMode('signup')}
            type='button'
          >
            Create account
          </button>
        </div>

        <form onSubmit={onSubmit} className='mt-5 space-y-4'>
          <div>
            <label className='mb-1 block text-sm text-slate-300'>Username</label>
            <input
              className='w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 outline-none focus:border-cyan-300'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Password</label>
            <input
              type='password'
              className='w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 outline-none focus:border-cyan-300'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className='flex items-center gap-2 text-sm text-slate-300'>
            <input type='checkbox' checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember this device
          </label>

          {error && <p className='text-sm text-red-300'>{error}</p>}

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-cyan-500/20 border border-cyan-300/40 py-2 font-medium hover:bg-cyan-500/30 disabled:opacity-50'
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account & sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
