import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link className="mt-6 underline underline-offset-4" to="/">
        Return home
      </Link>
    </main>
  )
}

export default NotFoundPage
