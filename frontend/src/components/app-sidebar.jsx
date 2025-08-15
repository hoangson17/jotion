import * as React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdOutlineNightlight } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUserStore } from "@/stores/store";
import { Label } from "@radix-ui/react-label";

export function AppSidebar(props) {
  const user = useUserStore((state) => state.user);
  const getUserFromServer = useUserStore((state) => state.getUserFromServer);

  const [dark, setDark] = React.useState(
    () => localStorage.getItem("theme") === "dark"
  );

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  React.useEffect(() => {
    getUserFromServer();
  }, []);
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu
              className={"flex flex-col gap-2 text-left p-2 text-lg"}
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Popover>
                    <PopoverTrigger className="text-sm">
                      {user.name}'s Jotion{" "}
                    </PopoverTrigger>
                    <PopoverContent className={"flex flex-col gap-4"}>
                      <p>{user.email}</p>
                      <p className="flex items-center gap-2">
                        <img
                          className="rounded-full"
                          src={
                            "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/291920933_448312317299864_478202528859404822_n.png?stp=dst-png_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=F-dxdkc4CbwQ7kNvwEPB4lX&_nc_oc=AdnIVWEIWZNYGbxqfO4MdVJnClYFw9x19h3BDMeChZfEc4XGDGhOS25jgu6APOy0ZII&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=5SwZx6sR58PDwUt-QCQRcw&oh=00_AfXaQP4nsWXYrHlDAWnQSaPRKKsPXlxtyRs07ozyl4vf5g&oe=68A070D1"
                          }
                          width={30}
                          alt=""
                        />
                        {user.name}'s Jotion
                      </p>
                      <button
                        className={"cursor-pointer border-t w-full text-left"}
                      >
                        Logout
                      </button>
                    </PopoverContent>
                  </Popover>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/*  */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Dialog>
                    <DialogTrigger>Search</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          <input
                            type="text"
                            className="w-[97%] p-1 mb-3 border-b-3"
                            placeholder="Search"
                          />
                        </DialogTitle>
                        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#4e4e4e]">
                          Document
                        </Label>
                        <DialogDescription>....</DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/*  */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Dialog>
                    <DialogTrigger>Setting</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>My Settings</DialogTitle>
                        <DialogDescription asChild>
                          <div className="flex justify-between items-center">
                            <div>
                              Appearance
                              <p className="text-sm text-[#4e4e4e]">
                                Customize how Jotion looks on your device
                              </p>
                            </div>
                            <div>
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
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
