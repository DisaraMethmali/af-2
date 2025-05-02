import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
