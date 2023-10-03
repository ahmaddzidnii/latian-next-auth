"use client";
import { signIn } from "next-auth/react";
import React from "react";

const ButtonLoginSocialMedia = ({ Icon, text, onClick }) => {
  return (
    <button type="button" className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-500 focus:outline-offset-0" onClick={onClick}>
      <Icon className=" mt-1 mr-2" /> <span className="text-lg">{text}</span>
    </button>
  );
};

export default ButtonLoginSocialMedia;
