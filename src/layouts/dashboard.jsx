import { Routes, Route } from "react-router-dom";
import React, { useState,useEffect } from 'react';
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import api from "@/ApiLink.mjs";
import CryptoJS from "crypto-js";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import routes1 from "@/routes1";
import routes2 from "@/routes2";
import { useMaterialTailwindController, setOpenConfigurator,setOpenSidenav } from "@/context";
// import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  // const { sidenavType } = controller;
  // const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [route1,setroute] = useState(true);
  const [allow,setallow] = useState(true);

  const decryptAndRetrieveData = (key) => {
    const encryptedData = localStorage.getItem('encryptedData');
    if (encryptedData) {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
      if (decryptedData) {
        return JSON.parse(decryptedData);
      }
    }
    return null;
  };

 

  useEffect(() => {
    const data = decryptAndRetrieveData("Harry");
    // console.log(data.user.id);
    if(data.user.rid =='4'){
      setroute(true);
    }

    
    
  },[]);


  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        routes1={routes1}
        routes2 = {routes2}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className={openSidenav? "p-4 xl:ml-80":"p-4 ml-10"}>
      {/* p-4 xl:ml-80 */}
        <DashboardNavbar />
       
        <Routes>
         
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route path={path} element={element} />
              ))
          )}
          
          {routes1.map(
            ({ layout, pages }) =>
              layout === "operator" &&
              pages.map(({ path, element }) => (
                <Route path={path} element={element} />
              ))
          )}

          {routes2.map(
            ({ layout, pages }) =>
              layout === "reports" &&
              pages.map(({ path, element }) => (
                <Route path={path} element={element} />
              ))
          )}
         
          
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
