import { LoginGoogleButton } from '@/components/login-google-button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main className='min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6'>
      <div className='w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl'>
        <h1 className='text-2xl font-semibold'>Pax Brain Access</h1>
        <p className='mt-2 text-sm text-slate-300'>Sign in with Google to continue.</p>
        <LoginGoogleButton hasOAuthError={Boolean(params?.error)} />
      </div>
    </main>
  )
}
