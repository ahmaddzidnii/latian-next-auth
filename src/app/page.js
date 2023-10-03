import Link from "next/link";
import NavbarComponent from "./components/NavbarComponents";
import { getSession } from "./session/getSession";

export default async function Home() {
  const session = await getSession();

  return (
    <main>
      <NavbarComponent session={session} />
      <div className=" mt-5 ml-2">
        <Link className=" w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" href="/dashboard">
          GO TO DASHBOARD
        </Link>
      </div>
    </main>
  );
}
