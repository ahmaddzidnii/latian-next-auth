import NavbarComponent from "@/app/components/NavbarComponents";
import WithAuth from "@/app/middleware/withAuth";
import { getSession } from "@/app/session/getSession";

const SettingsPage = async () => {
  const session = await getSession();
  return (
    <>
      <WithAuth session={session}>
        <NavbarComponent session={session} />
      </WithAuth>
    </>
  );
};

export default SettingsPage;
