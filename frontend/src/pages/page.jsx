import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote, useUser } from "@blocknote/react";
import { useUserStore } from "@/stores/store";

export default function Page() {
  const user = useUserStore((state) => state.user);
  const getUserFromServer = useUserStore((state) => state.getUserFromServer);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    getUserFromServer();
  }, []);
  // Khi theme thay đổi => cập nhật DOM & localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-white dark:bg-[#1f1f1f]">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {user.name}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="dark:bg-[#1F1F1F] bg-white h-full flex items-center justify-center">
          <div className="flex-1 p-4 dark:text-white text-black">
            <div className="flex flex-col items-center">
              <img
                className="w-[300px] hidden dark:block"
                src="https://notion-demo.unicode.vn/_next/image?url=%2Fempty-dark.png&w=640&q=75"
                alt="Empty note illustration"
              />
              <img 
                className="w-[300px] dark:hidden"
                src="https://notion-demo.unicode.vn/_next/image?url=%2Fempty.png&w=640&q=75" 
                alt="Empty note illustration" />
              <p className="text-xl font-semibold mt-4">
                Welcome to {user.name} Jotion
              </p>
              <button
                // onClick={handleCreatePage}
                className="mt-3 rounded-md bg-black text-black dark:bg-white dark:text-black text-white text-sm font-semibold h-10 px-4 py-2 cursor-pointer hover:bg-[#313131] dark:hover:bg-[#cdcdcd] transition-colors"
              >
                Create a note
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
