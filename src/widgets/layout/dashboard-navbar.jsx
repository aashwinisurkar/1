import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  ArrowLeftOnRectangleIcon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import api from "@/ApiLink.mjs";
import CryptoJS from "crypto-js";
import Changepass from "@/Changepass";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [name,setname] = useState('');
  const [data,setdata] = useState([]);
  const [u_id,setuid] = useState('');
  const [p_id,setpid] = useState('');
  const [cpass,setcpass] = useState(false);
  

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


  const handlechange = () =>{
    setcpass(!cpass);
    // setcpass((prevCpass) => !prevCpass);
    // setcpass((prevCpass) => !prevCpass);
  }

  const checkstatus = (value) =>{
    fetch(api+'checkstats',{
      method:'POST',
      body: JSON.stringify({id:value})
    })
    .then((response)=>response.json())
    .then((data)=> setdata(data.user))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });
  }
  // useEffect
  useEffect(() => {
    const decrydata = decryptAndRetrieveData("Harry");
    setname(decrydata.user.name);

    checkstatus(decrydata.user.id);
    setuid(decrydata.user.id);
    setpid(decrydata.user.pid);
    const refresh = setInterval(checkstatus(decrydata.user.id),1000);

    if(cpass){
      // setcpass(false);
    }
   
  },[cpass]);

  const logout = async() =>{
   const res = await fetch(api+'logout',{
      method:'POST',
      body: JSON.stringify({uid:u_id,pid:p_id})
    })
    if(res.ok){
    window.location.href='/';
    }
  
  }

  return (
    <>
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
          </Breadcrumbs>
          
        </div>
        <div className="flex items-center">
          
          
          <Link to="#">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              {name}
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>
          <Link to="#" onClick={logout}>
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
              LogOut
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>
          <Menu>
          <MenuHandler>
          <IconButton
            variant="text"
            color="blue-gray"
            // onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
          </MenuHandler>
          {/* <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <button onClick={handlechange} className="flex px-2">
                <IdentificationIcon  className="h-5 px-1" /> Change Password
                </button>
              </MenuItem>
            </MenuList> */}
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid"
            // xl: hidden
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          
        </div>
      </div>
    </Navbar>
    {cpass?<div className="bg-transparent"><Changepass uid={u_id} /></div>:null}
    {/* plazaid={()=> setcpass(!cpass)} */}
    </>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;


{/* <Avatar
                  src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div> */}