import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { UserForm } from "../UserForm";
import { updateUser } from "../actions";

interface Row {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const rows = await query<Row[]>("SELECT id, name, email, role FROM admin_users WHERE id = ?", [Number(id)]);
  const row = rows[0];
  if (!row) notFound();

  const boundAction = updateUser.bind(null, row.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">Edit User</h1>
      <UserForm initial={row} action={boundAction} submitLabel="Save" passwordRequired={false} />
    </div>
  );
}
