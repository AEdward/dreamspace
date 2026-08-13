"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form action={formAction} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-[#07283b]">Dreamspace Admin</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage site content.</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            autoFocus
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-lg bg-[#07283b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
