import { signIn } from '@/app/auth/actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        <form action={signIn} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required
            className="w-full border rounded px-3 py-2 text-sm" />
          <input name="password" type="password" placeholder="Password" required
            className="w-full border rounded px-3 py-2 text-sm" />
          <button type="submit"
            className="w-full bg-black text-white rounded py-2 text-sm font-medium hover:bg-gray-800">
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          No account? <a href="/signup" className="underline">Sign up</a>
        </p>
      </div>
    </main>
  )
}
