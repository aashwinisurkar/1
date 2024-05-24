
import {
    HomeIcon,
    UserCircleIcon,
    TableCellsIcon,
    InformationCircleIcon,
    ServerStackIcon,
    RectangleStackIcon,
  } from "@heroicons/react/24/solid";
  
import { OpHome, Profile,Entry,Entryreport} from "@/pages/dashboard";
// import { Entry } from "@/pages/dashboard"
const icon = {
    className: "w-5 h-5 text-inherit",
  };
  
  export const routes1 = [
    {
      layout: "operator",
      pages: [
        {
  icon: <HomeIcon {...icon} />,
  name: "Plaza Entry",
  path: "/ophome",
  element: <Entryreport />,
},
      
      ],
    },
    
  ];
  
  export default routes1;


  
