


import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";


export function Sidenav({ brandImg, brandName, routes,routes1,routes2 }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [admin, setAdmin] = useState(false);
  const [normal, setNormal] = useState(false);
  const [reportv,setreportview] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const sidenavTypes = {
    amber:"bg-gradient-to-br from-yellow-400 to-yellow-600",

    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

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
    const decrydata = decryptAndRetrieveData("Harry");
    const role = decrydata.user.role;
    // console.log(decrydata.user);
    if (role === 'Admin') {
      setAdmin(true);
    } else {
      if(decrydata.user.rid === "2"){
        setreportview(true)
      }else{
      setNormal(true);
      }
    }
  }, []);

  return (
    <aside className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"} fixed inset-0 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 border border-blue-gray-100 z-[10]`}
    style={{ overflowY: 'scroll', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
      <div className="relative h-full ">
      <div className={`relative `}>
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            <div className="flex justify-center items-center">
              <img
                src={'../../img/ashmilogo.jpeg'}
                className="h-[100px] w-[100px] object-cover"
              />
            </div>
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="blue"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4 ">
        {admin && (
          <>
        {routes.map(({ layout, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {pages.map(({ icon, name, path, subRoutes }, index) => (
              <li key={index}>
                {name && (
                  subRoutes ? (
                    <div>
                      <Button
                        variant="text"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        fullWidth
                        className="flex items-center gap-4 px-2 capitalize"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      >
                        {icon}
                        <Typography color="inherit" className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                      {openDropdown === index && (
                        <ul className="pl-8 mb-2 flex flex-col gap-1">
                          {subRoutes.map(({ icon: subIcon, name: subName, path: subPath }, subIndex) => (
                            <li key={subIndex}>
                              <NavLink to={`/${layout}${subPath}`}>
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 pl-2 pr-0 capitalize"
                                    fullWidth
                                  >
                                    {subIcon}
                                    <Typography color="inherit" className="font-medium capitalize">
                                      {subName}
                                    </Typography>
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                          className="flex items-center gap-4 px-2 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )
                )}
              </li>
            ))}
          </ul>
        ))}
        </>
        )}
        {normal && (
          <>
        {routes1.map(({ layout, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {pages.map(({ icon, name, path, subRoutes }, index) => (
              <li key={index}>
                {name && (
                  subRoutes ? (
                    <div>
                      <Button
                        variant="text"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        fullWidth
                        className="flex items-center gap-4 px-2 capitalize"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      >
                        {icon}
                        <Typography color="inherit" className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                      {openDropdown === index && (
                        <ul className="pl-8 mb-2 flex flex-col gap-1">
                          {subRoutes.map(({ icon: subIcon, name: subName, path: subPath }, subIndex) => (
                            <li key={subIndex}>
                              <NavLink to={`/${layout}${subPath}`}>
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-2 capitalize"
                                    fullWidth
                                  >
                                    {subIcon}
                                    <Typography color="inherit" className="font-medium capitalize">
                                      {subName}
                                    </Typography>
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                          className="flex items-center gap-4 px-2 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )
                )}
              </li>
            ))}
          </ul>
        ))}
        </>
        )}

{reportv && (
          <>
        {routes2.map(({ layout, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {pages.map(({ icon, name, path, subRoutes }, index) => (
              <li key={index}>
                {name && (
                  subRoutes ? (
                    <div>
                      <Button
                        variant="text"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        fullWidth
                        className="flex items-center gap-4 px-2 capitalize"
                        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      >
                        {icon}
                        <Typography color="inherit" className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                      {openDropdown === index && (
                        <ul className="pl-8 mb-2 flex flex-col gap-1">
                          {subRoutes.map(({ icon: subIcon, name: subName, path: subPath }, subIndex) => (
                            <li key={subIndex}>
                              <NavLink to={`/${layout}${subPath}`}>
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                                    className="flex items-center gap-4 px-2 capitalize"
                                    fullWidth
                                  >
                                    {subIcon}
                                    <Typography color="inherit" className="font-medium capitalize">
                                      {subName}
                                    </Typography>
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                          className="flex items-center gap-4 px-2 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )
                )}
              </li>
            ))}
          </ul>
        ))}
        </>
        )}
      </div>
      </div>
    </aside>
  );
}
// D:\pritesh\toll\ashmilogo.jpeg
Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Growbean Technology Pvt Ltd",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnav.jsx";

export default Sidenav;
