import { UserRecever } from "@/app/Entity/UserRecever";
import { notFound } from "next/navigation";
import { UploadProfessor } from "../UploadProfessor";
import { cookies } from "next/headers";
export default async function newProfessor() {
  const userManager = new UserRecever();
  const idIs = cookies().get("id") && (await userManager.isRole('admin/isAdmin'));
  if (!idIs) {
    notFound();
  }

  return <UploadProfessor />;
}
