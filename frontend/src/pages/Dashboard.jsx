import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/store";
import Sidebar from "../components/SideBar";
import MainContent from "../components/MainContent";
import Page from "../pages/page";

const Dashboard = () => {
  // const [isOpen, setIsOpen] = useState(true);

  // const user = useUserStore((state) => state.user);
  // const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  // const isLoading = useUserStore((state) => state.isLoading);
  // const getUserFromServer = useUserStore((state) => state.getUserFromServer);

  // useEffect(() => {
  //   getUserFromServer();
  // }, [getUserFromServer]);


  return (
    // <div className="bg-[#1F1F1F] h-[100vh] flex">
    //   <Sidebar
    //     isOpen={isOpen}
    //     setIsOpen={setIsOpen}
    //     userName={user.name}
    //     isAuthenticated={isAuthenticated}
    //   />
    //   <MainContent userName={user.name} />
    // </div>
    <Page/>
  );
};

export default Dashboard;
