"use client";

import { ContactForm } from "./ContactForm";

export function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#07283b]">Book an appointment</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-sm text-slate-500">Tell us how to reach you and we&apos;ll set up a time.</p>

        <div className="mt-6">
          <ContactForm
            source="booking"
            submitLabel="Book appointment"
            messageLabel="Preferred date / notes"
            messagePlaceholder="e.g. Weekday afternoons work best"
          />
        </div>
      </div>
    </div>
  );
}
