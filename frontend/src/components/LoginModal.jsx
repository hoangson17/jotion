import React, { useState } from "react";
import { useUserStore } from "../stores/store";
import { useNavigate } from 'react-router';


const LoginModal = ({ onClose }) => {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const navigator = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setAuthenticated = useUserStore((state) => state.setAuthenticated);
  const setLoading = useUserStore((state) => state.setLoading);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const respone = await fetch(
      `${import.meta.env.VITE_SERVER_API}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );
    if (respone.status === 401) {
      setMsg("Invalid Email or Password");
    }
    // const data= await respone.json();
    const { accessToken, refeshToken, user } = await respone.json();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refeshToken);
    localStorage.setItem("user", user.name);
    // luu user vao store
    setUser(user);
    setAuthenticated(true);
    setLoading(false);

    // chuyen huong ve trang chu
    // navigator("/");
    onClose();
    document.location.reload();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded shadow-lg w-full max-w-sm text-black dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Đăng nhập</h2>
        <form action="" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 mb-2 rounded bg-white dark:bg-[#2a2a2a] text-black dark:text-white"
          />
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 mb-4 rounded bg-white dark:bg-[#2a2a2a] text-black dark:text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
