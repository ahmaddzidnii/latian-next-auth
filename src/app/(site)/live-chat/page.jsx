import NavbarComponent from "@/app/components/NavbarComponents";
import WithAuth from "@/app/middleware/withAuth";
import { getSession } from "@/app/session/getSession";
import axios from "axios";

export const getUsers = async () => {
  const response = await axios.get("https://jsonplaceholder.typicode.com/comments");
  return response.data; // Mengembalikan data langsung tanpa perlu menggunakan Array
};

const LiveChat = async () => {
  const session = await getSession();
  const data = await getUsers();

  return (
    <WithAuth session={session}>
      <NavbarComponent session={session} />
      <div>
        {data &&
          data.map((u) => {
            return <h1 key={u.id}>{u.name}</h1>;
          })}
      </div>
    </WithAuth>
  );
};

export default LiveChat;
