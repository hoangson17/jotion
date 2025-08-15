import React, { useEffect, useState } from "react";
import { MdOutlineNightlight } from "react-icons/md";
import LoginModal from "./LoginModal";
import { Link } from "react-router";
import { useUserStore } from "../stores/store";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const setUser = useUserStore((state) => state.setUser);
  const setAuthenticated = useUserStore((state) => state.setAuthenticated);
  const setLoading = useUserStore((state) => state.setLoading);
  const getUserFromServer = useUserStore((state) => state.getUserFromServer);
  const [scrolled, setScrolled] = useState(false);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handLogout = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !confirm("ban co chac ")) {
      return false;
    }
    fetch(`${import.meta.env.VITE_SERVER_API}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser({});
    setAuthenticated(false);
    setLoading(false);
  };

  useEffect(() => {
    getUserFromServer();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // thay ngưỡng nếu muốn border xuất hiện sớm/muộn hơn
      setScrolled(window.scrollY > 10);
    };

    // passive để cải thiện hiệu năng
    window.addEventListener("scroll", onScroll, { passive: true });
    // kiểm tra ngay lúc mount (trường hợp load với scroll sẵn)
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={
          `z-50 bg-background dark:bg-[#1F1F1F] sticky top-0 flex items-center w-full p-6 transition-all duration-200 ` +
          (scrolled
            ? "border-b border-gray-200 dark:border-[#313131] backdrop-blur-sm"
            : "border-b border-transparent")
        }
      >
        <div className="flex items-center text-primary dark:text-white gap-x-2">
          <Link to="/" className="flex items-center gap-x-2">
            <img
              className="hidden dark:block w-10"
              src="https://jotion.osadhiv.com/logo-dark.svg"
              alt="Jotion logo"
            />
            <img
              className="dark:hidden w-10"
              src="https://jotion.osadhiv.com/logo.svg"
              alt="Jotion logo"
            />
            <p className="font-semibold">Jotion</p>
          </Link>
        </div>

        <div className="flex items-center ml-auto gap-x-2">
          <div>
            {isLoading ? (
              <>Loading ........</>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-2 py-1 text-primary dark:text-white cursor-pointer hover:dark:bg-[#373737] rounded"
                >
                  Enter Jotion
                </Link>
                <button
                  className="px-2 py-1 text-primary dark:text-white cursor-pointer hover:dark:bg-[#373737] rounded"
                  onClick={handLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-2 py-1 text-primary dark:text-white cursor-pointer hover:dark:bg-[#373737] rounded"
                >
                  Log in
                </button>

                <button className="px-2 py-1 rounded text-white bg-black dark:text-black dark:bg-white dark:hover:bg-[#cdcdcd] hover:bg-[#373737] cursor-pointer">
                  Get jotion free
                </button>
              </>
            )}
          </div>
          <button
            className="text-primary dark:text-white cursor-pointer w-10 h-10 dark:bg-black flex items-center justify-center rounded hover:dark:bg-[#373737]"
            onClick={() => setDark(!dark)}
          >
            <MdOutlineNightlight
              className="dark:text-white text-black"
              size={24}
            />
          </button>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Header;
