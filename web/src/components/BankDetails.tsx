"use client";

import { motion } from "framer-motion";
import type { BankAccount } from "@/lib/types";

export function BankDetails({ accounts }: { accounts: BankAccount[] }) {
  if (accounts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-[#07283b] sm:text-4xl"
      >
        Bank details
      </motion.h2>
      <p className="mt-3 max-w-xl text-slate-500">
        Send registration/service fee and price payments to these accounts.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-slate-200"
      >
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#07283b] text-white">
              <th className="px-5 py-4 font-semibold">Bank</th>
              <th className="px-5 py-4 font-semibold">Registration & service fee account</th>
              <th className="px-5 py-4 font-semibold">Price payment account</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, i) => (
              <tr key={account.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-5 py-4 font-medium text-[#07283b]">{account.bankName}</td>
                <td className="px-5 py-4 font-mono text-slate-700">{account.registrationAccount}</td>
                <td className="px-5 py-4 font-mono text-slate-700">{account.priceAccount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
