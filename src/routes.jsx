import {
  HomeIcon,
  TableCellsIcon,
  ServerStackIcon,
  CurrencyRupeeIcon,
  PencilSquareIcon,
  BanknotesIcon,
  ArchiveBoxXMarkIcon,
  ArchiveBoxIcon,
  PlusCircleIcon,
  DocumentChartBarIcon,
  DocumentIcon,
  WalletIcon,
  Square3Stack3DIcon
} from "@heroicons/react/24/solid";
import { Home, Profile,Tables,Plazatable, Opening_report, Remitance, AdminEntry, Hoexpenserep, 
  ExpenseHead, Cons,Weekly_rem_report,HoexpDetail,Month_wise_report,TpexpDetail,Salprov,Tpexpsum,Daily_rem_report } from "@/pages/dashboard";
import { element } from "prop-types";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <Home />,
      },
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
            icon:<DocumentChartBarIcon {...icon} />,
            name:"Daily Remittance",
            path:"/report/dailyreport",
            element:<Daily_rem_report/>
          },
          {
            icon: <PlusCircleIcon {...icon} />,
            name: "Closing Balance",
            path: "/report/oarep",
            element: <Opening_report />,
          },
          {
            icon: <CurrencyRupeeIcon {...icon} />,
            name: "Collection",
            path: "/report/remittance",
            element: <Remitance />,
          },
          {
            icon:<Square3Stack3DIcon {...icon} />,
            name:"Expense Summary I",
            path:"/report/sumexp",
            element:<Tpexpsum/>,
          }
        ],
      },
      {
        icon: <PencilSquareIcon {...icon} />,
        name: "Entry",
        subRoutes: [
          {
            icon: <PencilSquareIcon {...icon} />,
            name: "Plaza Entry",
            path: "/entryreport",
            element: <Profile />,
          },
          {
            icon: <BanknotesIcon {...icon} />,
            name: "H.O Expense",
            path: "/expenseho",
            element: <Hoexpenserep />,
          },
        ],
      },
      {
        icon: <ArchiveBoxIcon {...icon} />,
        name: "Master",
        subRoutes: [
          {
            icon: <ArchiveBoxIcon {...icon} />,
            name: "Expense Head",
            path: "/expensehead",
            element: <ExpenseHead />,
          },
          {
            icon: <TableCellsIcon {...icon} />,
            name: "User Master",
            path: "/tables",
            element: <Tables />,
          },

          {
            icon: < ArchiveBoxXMarkIcon  {...icon} />,
            name: " Plaza Master",
            path: "/plazauser ",
            element: <Plazatable/>,
          }
        ],
      },
      {
        path: "/expensehead",
        element: <ExpenseHead />,
      },
      {
        path: "/tables",
        element: <Tables />,
      },
      {
        path: "/plazauser",
        element: <Plazatable />,
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
      {
        path: "/entryreport",
        element: <AdminEntry />,
      },
      {
        path: "/expenseho",
        element: <Hoexpenserep />,
      },
      {
        path:"/salaryprovison",
        element:<Salprov />,
      },
      {
        path:"/report/sumexp",
        element:<Tpexpsum/>,
      },
      {
        path:"/report/dailyreport",
        element:<Daily_rem_report/>
      },
    ],
  },
];

export default routes;