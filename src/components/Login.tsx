import {
  useState,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAdminStore } from "../store/useAdminStore";
import { useToast } from "../hooks/useToast";

// @ts-ignore
import Logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const login = useAdminStore(
    (state) => state.login
  );

  const authLoading = useAdminStore(
    (state) => state.authLoading
  );

  const authError = useAdminStore(
    (state) => state.authError
  );

  const { success, error } = useToast();

  const [email, setEmail] = useState(
    "globalwelfarefoundations1@gmail.com"
  );

  const [password, setPassword] = useState(
    "12345"
  );

  const [show, setShow] = useState(false);

  const [remember, setRemember] =
    useState(true);

  const submit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      error("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      error("Please enter your password.");
      return;
    }

    const successLogin = await login(
      email.trim(),
      password,
      remember
    );

    if (successLogin) {
      success(
        "Welcome back! Login successful."
      );

      navigate("/dashboard", {
        replace: true,
      });
    } else {
      error(
        useAdminStore.getState().authError ??
        "Invalid email or password."
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">

      {/* -------------------------------- */}
      {/* LEFT BRAND PANEL */}
      {/* -------------------------------- */}

      <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-stone-900 p-10 text-stone-50 lg:flex lg:w-1/2 xl:p-10">

        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, #d9aa3f 0%, transparent 55%)",
          }}
        />

        <div className="relative flex items-center justify-center gap-3">
          <img
            src={Logo}
            alt="Global Welfare Foundation"
            className="h-auto w-32 object-contain sm:w-36 lg:w-40 xl:w-48"
          />
        </div>

        <div className="relative m-[auto] max-w-md text-center">
          <h2 className="text-3xl font-semibold leading-tight xl:text-4xl">
            Building stronger communities,
            one initiative at a time.
          </h2>

          <p className="mt-4 text-stone-400">
            Manage your foundation's programmes,
            partnerships and impact from a single,
            elegant workspace.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-6 border-t border-stone-700 pt-8">

          <div className="flex flex-col">
            <strong className="text-2xl font-semibold text-[#d9aa3f]">
              120+
            </strong>

            <span className="text-xs text-stone-400">
              Projects delivered
            </span>
          </div>

          <div className="flex flex-col">
            <strong className="text-2xl font-semibold text-[#d9aa3f]">
              28
            </strong>

            <span className="text-xs text-stone-400">
              Active programmes
            </span>
          </div>

          <div className="flex flex-col">
            <strong className="text-2xl font-semibold text-[#d9aa3f]">
              14
            </strong>

            <span className="text-xs text-stone-400">
              Communities served
            </span>
          </div>

        </div>
      </div>

      {/* -------------------------------- */}
      {/* RIGHT LOGIN PANEL */}
      {/* -------------------------------- */}

      <div className="flex w-full flex-1 items-center justify-center bg-stone-50 px-4 py-10 sm:px-8 lg:w-1/2">

        <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-6 flex flex-col items-center text-center lg:items-start lg:text-left">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#d9aa3f] text-sm font-bold text-stone-900 lg:hidden">
              <img
                src={Logo}
                alt="Global Welfare Foundation"
                className="h-auto w-32 object-contain"
              />
            </div>

            <h1 className="text-xl font-semibold text-stone-900">
              Welcome back
            </h1>

            <p className="mt-1 text-xs text-stone-500">
              Sign in to the Global Welfare Foundation
              admin portal.
            </p>

          </div>

          <form
            onSubmit={submit}
            noValidate
            className="flex flex-col gap-4"
          >

            {/* EMAIL */}

            <label className="flex flex-col gap-1.5">

              <span className="text-sm font-medium text-stone-700">
                Email address
              </span>

              <div className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2.5 focus-within:border-[#d9aa3f] focus-within:ring-2 focus-within:ring-[#d9aa3f]/20">

                <Mail
                  size={18}
                  className="shrink-0 text-stone-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@gwf.org"
                  autoComplete="username"
                  disabled={authLoading}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />

              </div>

            </label>

            {/* PASSWORD */}

            <label className="flex flex-col gap-1.5">

              <span className="text-sm font-medium text-stone-700">
                Password
              </span>

              <div className="flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2.5 focus-within:border-[#d9aa3f] focus-within:ring-2 focus-within:ring-[#d9aa3f]/20">

                <Lock
                  size={18}
                  className="shrink-0 text-stone-400"
                />

                <input
                  type={
                    show ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={authLoading}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShow((value) => !value)
                  }
                  aria-label={
                    show
                      ? "Hide password"
                      : "Show password"
                  }
                  className="shrink-0 text-stone-400 hover:text-stone-600"
                >
                  {show ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </label>

            {/* REMEMBER */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-stone-600">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(
                      event.target.checked
                    )
                  }
                  disabled={authLoading}
                  className="h-4 w-4 rounded border-stone-300 text-[#d9aa3f] focus:ring-[#d9aa3f]"
                />

                <span className="flex items-center gap-1">
                  <ShieldCheck size={15} />
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="font-medium text-[#b98a2c] hover:underline"
              >
                Forgot password?
              </button>

            </div>

            {/* API ERROR */}

            {authError && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {authError}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              disabled={authLoading}
              className="mt-1 w-full rounded-lg bg-[#d9aa3f] px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-[#c99a34] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {authLoading
                ? "Signing in..."
                : "Sign in to portal"}
            </button>

          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-stone-400 lg:justify-start">
            <ShieldCheck size={15} />
            Protected by GWF security · Two-factor ready
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;