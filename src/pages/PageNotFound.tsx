import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <h1 className="text-9xl font-extrabold text-purple-600">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mt-4">
          Oops! Page not found
        </h2>
      </div>
      <p className="text-slate-500 mt-2 mb-8 max-w-md">
        The joke you're looking for might have been deleted, or the URL is just
        plain wrong.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition shadow-md"
      >
        Back to Safety
      </Link>
    </div>
  );
}
