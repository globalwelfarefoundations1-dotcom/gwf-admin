import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#086D63]/10 text-[#086D63]">
          <SearchX size={30} />
        </div>

        <p className="text-7xl font-bold tracking-tight text-stone-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-stone-900">
          Page not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          The page you are looking for doesn't exist or may have
          been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#086D63] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#075b53]"
          >
            <Home size={16} />
            Dashboard
          </button>

        </div>
      </div>
    </div>
  );
}