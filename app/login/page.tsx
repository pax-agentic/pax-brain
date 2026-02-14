import { GoogleLogo } from '@phosphor-icons/react/dist/ssr'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = Boolean(params?.error)

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6'>
      <div className='w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl'>
        <h1 className='text-2xl font-semibold'>Pax Brain Access</h1>
        <p className='mt-2 text-sm text-slate-300'>Sign in with Google to continue.</p>

        {hasError && (
          <p className='mt-4 rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200'>
            Access denied. This Google account is not authorized for Pax Brain.
          </p>
        )}

        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href='/api/auth/sign-in/social?provider=google&callbackURL=/'
          className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-500/20 py-2 font-medium hover:bg-cyan-500/30'
        >
          <GoogleLogo size={18} weight='duotone' />
          Sign in with Google
        </a>
      </div>
    </main>
  )
}
