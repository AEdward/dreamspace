import { requireAdmin } from "@/lib/auth";
import { UserForm } from "../UserForm";
import { createUser } from "../actions";

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#07283b]">New User</h1>
      <UserForm action={createUser} submitLabel="Create" passwordRequired />
    </div>
  );
}
