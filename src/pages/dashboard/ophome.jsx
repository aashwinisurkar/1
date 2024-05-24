import React,{useState,useEffect} from "react";
import { chartsConfig } from "@/configs";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Button,
  Collapse,
  Alert
} from "@material-tailwind/react";

import {
  BanknotesIcon,
  ChartBarIcon,
  TicketIcon,
  BuildingStorefrontIcon,
  BellIcon
} from "@heroicons/react/24/solid";
import CryptoJS from 'crypto-js';

import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import api from "@/ApiLink.mjs";

export function OpHome() {
  const [totalcoll,settotalcoll] = useState("");
  const [expense,setexpense] = useState("");
  const [fst,setfst] = useState("");
  const [plaza,setplaza] = useState("");
  const [showinfo,setshowinfo] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [currentItems,setcurrentItems] = useState([]);
  const [currentItems1,setcurrentItems1] = useState([]);
  const [currentItems2,setcurrentItems2] = useState([]);
  const [currentItems3,setcurrentItems3] = useState([]);
  const [monthlysale,setmonthlysale] = useState([]);
  const [monthlyexp,setmonthlyexp] = useState([]);
  const [logoutdialog,setlogoutdialog] = useState(false);
  const [erropen1, seterrOpen1] = useState(false);
  const [cstat,setstat] = useState('');
 
  const toggleOpen = () => setOpen((cur) => !cur);
  const toggleOpen1 = () => setOpen1((cur) => !cur);
  const toggleOpen2 = () => setOpen2((cur) => !cur);
  const toggleOpen3 = () => setOpen3((cur) => !cur);

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
  
  const checkstatus = () =>{
    const decrydata1 = decryptAndRetrieveData("Harry");
    if(decrydata1){
    fetch(api+'checkstats',{
      method:'POST',
      body: JSON.stringify({id: decrydata1.user.id})
    })
    .then((response)=>response.json())
    .then((data)=> setstat(data.ResponseCode))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });
  }
  }
  

    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 3000); 

  useEffect(() => {

    const dataitem = localStorage.getItem('encryptedData');
    if(dataitem === null){
      window.location.href='/';
    }else{
      setshowinfo(true);
    }
    const refresh = setInterval(checkstatus,20000);
    const data = decryptAndRetrieveData("Harry");
    const id = data.user.pid;
    // stat api
    // console.log(dataitem);
    fetch(api+'getplazastat',{
      method:'POST',
      body: JSON.stringify({'plaza':id})
    })
      .then((response) => response.json())
      .then((data) => {
        // setPlazas(data);
        // console.log(data.data);
        settotalcoll(data.data.total_collection_sum ?? 0);
        setexpense(data.data.Expense ?? 0);
        setfst(data.data.fast ?? 0);
        setplaza(data.data.plaza ?? 0);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
        
      },[]);
      
      
      if(cstat=='403'){
        setlogoutdialog(true);
        window.location.href='/';
      }
      
      
      // monthly sales report
      const currentYear = new Date().getFullYear();
      fetch(api+'monthlyplazasalesamount',{
        method: 'POST',
        body: JSON.stringify({ year: currentYear,plaza:id }),
      })
      .then((response) => response.json())
      .then((data) => {
        // setcurrentItems3(data.data);
        // console.log(data.Result);
        setmonthlysale(data.Result);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // monthly expense report
      // const currentYear = new Date().getFullYear();
      fetch(api+'monthlyplazaexpemseamount',{
        method: 'POST',
        body: JSON.stringify({ year: currentYear ,plaza:id}),
      })
      .then((response) => response.json())
      .then((data) => {
        // setcurrentItems3(data.data);
        // console.log(data.Result);
        setmonthlyexp(data.Result);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
  },[cstat]);

  const entriesData = monthlysale.map((item) => parseInt(item.amount));
  // const allMonths = Array.from({ length: 12 }, (_, index) => {
  //   // Assuming your API returns month numbers (1-12)
  //   // You may need to adjust this based on your API response
  //   return new Date(2023, index, 1).toLocaleString('default', { month: 'long' });
  // });

  const uniqueMonths = [...new Set(monthlysale.map(item => item.month))];

const allMonths = uniqueMonths.map(month => {
  const monthNumber = parseInt(month, 10);
  return new Date(2024, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
});

  const expentry = monthlyexp.map((item)=> parseInt(item.amount));
  const entrydetails = monthlyexp.map((item)=> parseInt(item.entries));

  const MonthlySale = {
    type: "bar",
    height: 380,
    series: [
      {
        name: "Collection",
        data: entriesData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "26%",
          borderRadius: 10,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: allMonths,
      },
    },
  };

  const expenseenty = {
    type: "line",
    height: 380,
    series: [
      {
        name: "Expense",
        data: expentry,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: allMonths
      },
    },
  };

  const entrydetail = {
    type: "line",
    height: 380,
    series: [
      {
        name: "Entries",
        data: entrydetails,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: allMonths
      },
    },
  };
  
  

  return (
    <>
    {logoutdialog ? (
      <div className="fixed top-0">
        <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
        Updation Failed
        {window.location.href='/'}
      </Alert>
      </div>
      ):<div></div>}
    {showinfo ? 
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        
      <button onClick={toggleOpen}>
          <StatisticsCard
                key="Total Collection"
                title="Total Collection"
                icon={React.createElement(BanknotesIcon, {
                className: "w-6 h-6 text-white",
                })}
                value = {totalcoll}
            />
      </button>

      <button onClick={toggleOpen1}> 
          <StatisticsCard
            key="Expenses"
            title="Expenses"
            icon={React.createElement(ChartBarIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {expense}
          />
          {/* </IconButton> */}
           {/* </MenuHandler> */}
           
          {/* menulist start */}
          {/* menulist end */}
          </button>
          <button onClick={toggleOpen2} >
          <StatisticsCard
            key="Fast Tag"
            title="Fast Tag Collection"
            icon={React.createElement(TicketIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {fst}
          />
          </button>
          <button  onClick={toggleOpen3}>
          <StatisticsCard
            key="plaza"
            title="Plaza Name"
            icon={React.createElement(BuildingStorefrontIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {plaza.toUpperCase()}
          />
          </button>
        
      </div>

     
      
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {/* {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))} */}

        <StatisticsChart
        key = 'Website View'
        color="white" 
        description = "MonthWise Total Collection"
        title = "Monthly Sales"
        chart ={MonthlySale} 
        />
        <StatisticsChart
        key = 'Daily Sales'
        color="white" 
        description = "MonthWise Expenses "
        title = "Monthly Expenses"
        chart ={expenseenty} 
        />
        <StatisticsChart
        key = 'Daily Sales 1'
        color="white" 
        description = "MonthWise Entries "
        title = "Monthly Entries"
        chart ={entrydetail} 
        />
      </div>
    </div>
    : <div></div>}
    </>
  );
}

export default OpHome;


{/* <div className="mt-[-48px] mb-12 w-full grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2 ">
      <Collapse open={open}>
        <Card className="my-4 mx-auto w-[85%]">
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Total Collection
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(({ name, total_collection }, key) => {
                  const className = `py-3 px-5 ${
                    key === currentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {total_collection}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </Collapse>
      <Collapse open={open1}>
        <Card className="my-4 mx-auto w-8/12">
          <CardBody>
            <Typography>
              Use our Tailwind CSS collapse for your website. You can use if for
              accordion, collapsible items and much more.
            </Typography>
          </CardBody>
        </Card>
      </Collapse>
      <Collapse open={open2}>
        <Card className="my-4 mx-auto w-8/12">
          <CardBody>
            <Typography>
              Use our Tailwind CSS collapse for your website. You can use if for
              accordion, collapsible items and much more.
            </Typography>
          </CardBody>
        </Card>
      </Collapse>
      <Collapse open={open3}>
        <Card className="my-4 mx-auto w-8/12">
          <CardBody>
            <Typography>
              Use our Tailwind CSS collapse for your website. You can use if for
              accordion, collapsible items and much more.
            </Typography>
          </CardBody>
        </Card>
      </Collapse>
      </div> */}
