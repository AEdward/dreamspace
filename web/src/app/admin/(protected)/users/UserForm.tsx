"use client";

import { useActionState } from "react";

const inputClass =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#07283b] focus:outline-none";
const labelClass = "block text-sm font-medium text-slate-700";

interface UserFormValues {
  name: string;
  email: string;
  role: "admin" | "editor";
}

export function UserForm({
  initial,
  action,
  submitLabel,
  passwordRequired,
}: {
  initial?: UserFormValues;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  submitLabel: string;
  passwordRequired: boolean;
}) {
  const [message, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className={labelClass}>
        Name
        <input name="name" defaultValue={initial?.name} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" defaultValue={initial?.email} required className={inputClass} />
      </label>
      <label className={labelClass}>
        {passwordRequired ? "Password" : "New password (leave blank to keep current)"}
        <input
          name="password"
          type="password"
          required={passwordRequired}
          minLength={8}
          placeholder={passwordRequired ? undefined : "••••••••"}
          className={inputClass}
        />
      </label>
      <fieldset>
        <legend className={labelClass}>Role</legend>
        <div className="mt-2 flex gap-6 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="admin" defaultChecked={initial?.role === "admin" || !initial} />
            Admin — full access
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="editor" defaultChecked={initial?.role === "editor"} />
            Editor — content only
          </label>
        </div>
      </fieldset>

      {message && <p className="text-sm text-emerald-600">{message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#07283b] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0a3550] disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
