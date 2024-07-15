import { UserRecever } from "../Entity/UserRecever";
import { cookies } from "next/headers";
import { LogOut } from "./LogOut";
import { ProfileComponent } from "./ProfileComponent";
import { notFound } from "next/navigation";
function convertToStars(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += "*";
  }
  return result;
}

const getUser = async () => {
  const id: string | undefined = cookies().get("id")?.value;
  if (id !== undefined) {
    const userManager = new UserRecever();
    const user = await userManager.getUser("");
    return {
      username: user.username,
      email: user.email,
      password: convertToStars(user.password),
      profileImage: user.profileImage,
      role: user.role,
    };
  } else {
    notFound();
  }
};
export default async function Profile() {
  const { username, email, password, role, profileImage }: any =
    await getUser();
  return (
    <div className="flex justify-center items-center h-full w-screen">
      <ProfileComponent
        username={username}
        email={email}
        password={password}
        role={role}
        profileImage={profileImage}
      />
    </div>
  );
}
