import React from "react";
import { useNavigate } from "react-router";

const MainContent = ({ userName }) => {
  const navigate = useNavigate();

  const handleCreatePage = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Bạn cần đăng nhập trước");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: "Untitled",
          content: "",
        }),
      });

      if (!res.ok) throw new Error("Không thể tạo page");

      const newPage = await res.json();

      // Điều hướng sang trang vừa tạo
      navigate();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo page");
    }
  };

  return (
    <div className="flex-1 p-4 text-white">
      <div className="flex justify-center flex-col items-center h-full">
        <img
          className="w-[300px] h-[225px]"
          src={
            "https://notion-demo.unicode.vn/_next/image?url=%2Fempty-dark.png&w=640&q=75"
          }
          alt=""
        />
        <p className="text-xl font-semibold">
          Welcome to {userName} Jotion
        </p>
        <button
          onClick={handleCreatePage}
          className="mt-3 rounded-md bg-white text-black text-sm font-semibold h-10 px-4 py-2 cursor-pointer hover:bg-[#cdcdcd]"
        >
          Create a note
        </button>
      </div>
    </div>
  );
};

export default MainContent;
