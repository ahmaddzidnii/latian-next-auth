import Link from "next/link"

export default function Home() {
  return (
  <main>
    <div className=" mt-5 ml-2">
      <Link className=" w-full bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" href="/dashboard">
      GO TO DASHBOARD
      </Link>
    </div>
  </main>
  )
}
