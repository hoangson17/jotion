import React from "react";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen, userName, isAuthenticated }) => {
  if (!isOpen) {
    return (
      <div className="text-white cursor-pointer">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-5 rounded"
        >
          <FaBars className="w-7 h-7" />
        </button>
      </div>
    );
  }

  return (
      <div className="dark:bg-[#262626] p-4 w-[300px] h-screen text-white">
        <div className="flex justify-between items-center">
          <p className="font-bold">
            {isAuthenticated ?  userName : "Jotion" }
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded cursor-pointer"
          >
            <MdOutlineKeyboardDoubleArrowLeft className="w-7 h-7" />
          </button>
        </div>
      </div>
  );
};

export default Sidebar;
