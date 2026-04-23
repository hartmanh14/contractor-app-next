import { signUp } from '@/app/auth/actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Create account</h1>
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        <form action={signUp} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required
            className="w-full border rounded px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Password (8+ chars)" required minLength={8}
            className="w-full border rounded px-3 py-2 text-sm" />
          <button type="submit"
            className="w-full bg-black text-white rounded py-2 text-sm font-medium hover:bg-gray-800">
            Create account
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Have an account? <a href="/login" className="underline">Sign in</a>
        </p>
      </div>
    </main>
  )
}
