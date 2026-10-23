import { useState } from 'react'
import { createAuthClient } from 'better-auth/react'

const inputClasses =
  'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/15'
const authClient = createAuthClient({ baseURL: window.location.origin })

export default function Login() {
  const {
    data: session,
    isPending: checkingSession,
    refetch: refreshSession,
  } = authClient.useSession()
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      const result = isSigningUp
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
          })

      if (result.error) {
        throw new Error(result.error.message)
      }

      await refreshSession()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignOut() {
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      const result = await authClient.signOut()
      if (result.error) {
        throw new Error(result.error.message)
      }
      await refreshSession()
      setPassword('')
      setMessage('You have been signed out.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 py-10">
      <section className="w-full max-w-md rounded-xl border border-line bg-white p-7 shadow-soft sm:p-9">
        <a
          href="/"
          className="font-bold italic text-ink transition-colors hover:text-orange"
        >
          explore<span className="text-orange">SouthA</span>
        </a>

        {checkingSession ? (
          <p className="mt-8" role="status">
            Checking your session...
          </p>
        ) : session?.user ? (
          <div className="mt-8">
            <h1 className="font-serif text-2xl font-bold">You’re signed in</h1>
            <p className="mt-2 text-sm text-muted">
              Signed in as {session.user.name} ({session.user.email})
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/"
                className="rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-dark"
              >
                Return to ExploreSouthA
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={submitting}
                className="rounded-full border border-line px-5 py-2.5 text-sm font-bold transition hover:border-orange hover:text-orange disabled:opacity-60"
              >
                {submitting ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-8 font-serif text-2xl font-bold">
              {isSigningUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {isSigningUp
                ? 'Create an account to get started.'
                : 'Sign in to your ExploreSouthA account.'}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {isSigningUp && (
                <div>
                  <label className="mb-1 block text-sm font-semibold" htmlFor="name">
                    Name
                  </label>
                  <input
                    autoComplete="name"
                    className={inputClasses}
                    id="name"
                    maxLength={160}
                    onChange={(event) => setName(event.target.value)}
                    required
                    value={name}
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className={inputClasses}
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  autoComplete={
                    isSigningUp ? 'new-password' : 'current-password'
                  }
                  className={inputClasses}
                  id="password"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </div>

              <button
                className="w-full rounded-full bg-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-dark disabled:cursor-wait disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting
                  ? 'Please wait...'
                  : isSigningUp
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              {isSigningUp ? 'Already have an account?' : 'New to ExploreSouthA?'}{' '}
              <button
                className="font-semibold text-orange hover:underline"
                onClick={() => {
                  setIsSigningUp(!isSigningUp)
                  setError('')
                  setMessage('')
                }}
                type="button"
              >
                {isSigningUp ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </>
        )}

        {error && (
          <p className="mt-5 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-5 text-sm text-green-700" role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  )
}
