import {
  HomeIcon,
  TableCellsIcon,
  ServerStackIcon,
  CurrencyRupeeIcon,
  PencilSquareIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  DocumentIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Opening_report, Remitance, AdminEntry, Hoexpenserep, ExpenseHead, Cons,Weekly_rem_report,HoexpDetail,Month_wise_report,TpexpDetail } from "@/pages/dashboard";
import { element } from "prop-types";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes2 = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Reports",
        subRoutes: [
          {
            icon: <ServerStackIcon {...icon} />,
            name: "Plaza Report",
            path: "/report/plazarep",
            element: <Profile />,
          },
          {
            icon: <ServerStackIcon {...icon} />,
            name: "Consolidated Report",
            path: "/report/consolrep",
            element: <Cons />,
          },
          {
            icon:<DocumentIcon {...icon} />,
            name:"Consolidated Report II",
            path:"/report/monthlyreport",
            element:<Month_wise_report/>
          },
          {
            icon:<DocumentIcon {...icon} />,
            name:"H.O Expense Report",
            path:"/report/expensereportho",
            element:<HoexpDetail/>
          },
          {
            icon:<DocumentIcon {...icon} />,
            name:"Plaza Expense Report",
            path:"/report/expensereporttp",
            element:<TpexpDetail/>
          },
          {
            icon:<DocumentChartBarIcon {...icon} />,
            name:"Weekly Remittance",
            path:"/report/weeklyreport",
            element:<Weekly_rem_report/>
          },
          {
            icon: <PlusCircleIcon {...icon} />,
            name: "Closing Balance",
            path: "/report/oarep",
            element: <Opening_report />,
          },
          {
            icon: <CurrencyRupeeIcon {...icon} />,
            name: "Remittance",
            path: "/report/remittance",
            element: <Remitance />,
          },
        ],
      },
      {
        path: "/report/plazarep",
        element: <Profile />,
      },
      {
        path: "/report/remittance",
        element: <Remitance />,
      },
      {
        path:"/report/monthlyreport",
        element:<Month_wise_report/>,
      },
      {
        path:"/report/weeklyreport",
        element:<Weekly_rem_report/>
      },
      {
        path: "/report/oarep",
        element: <Opening_report />,
      },
      {
        path: "/report/consolrep",
        element: <Cons />,
      },
      {
        path:"/report/expensereportho",
        element:<HoexpDetail/>
      },
      {
        path:"/report/expensereporttp",
        element:<TpexpDetail/>
      },
    ],
  },
];

export default routes2;
