'use client'

import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <button className="w-25 mt-2 ml-2 bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50" onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
