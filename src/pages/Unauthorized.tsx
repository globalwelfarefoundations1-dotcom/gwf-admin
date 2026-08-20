import { ShieldX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <ShieldX size={30} />
        </div>

        <h1 className="text-2xl font-semibold text-stone-900">
          Access denied
        </h1>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          You don't have permission to access this page.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#086D63] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#075b53]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}