import React,{useState,useEffect,useMemo} from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
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
import { blue } from "@mui/material/colors";
import { WidthFull } from "@mui/icons-material";

const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];

export function Home() {

  
  // const [filter, setFilter] = useState('');

  // const handleFilterChange = (event) => {
  //   setFilter(event.target.value);
  // };

  // const [filterValues, setFilterValues] = useState({
  //   name: '',
  //   addr: '',
  //   valid_from: '',
  //   valid_to: ''
  // });

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilterValues({
  //     ...filterValues,
  //     [name]: value
  //   });
  // };

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Sort function based on column and order
  const sortItems = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  

  const [table341, setTable341] = useState(null);
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
  const [monthlyremi,setmonthlyremi] = useState([]);
  const [cstat,setstat] = useState('');

 

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }
  

  

    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 3000); 


    const formatnum = (num,precision =2) =>{
      const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'Cr', threshold: 1e7 },
        { suffix: 'L', threshold: 1e5 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 0 },
      ];
    
      const found = map.find((x) => Math.abs(num) >= x.threshold);
      if (found) {
        // Handle the case where precision is 0
        const formatted = found.threshold === 0
          ? Math.floor(num).toString() // No decimal point for the last object
          : (num / found.threshold).toFixed(precision) + found.suffix;
        return formatted;
      }
    
      return num.toString();
    }

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
      const decrydata = decryptAndRetrieveData("Harry");
      if(decrydata){
        // console.log(decrydata);
      fetch(api+'checkstats',{
        method:'POST',
        body: JSON.stringify({id: decrydata.user.id})
      })
      .then((response)=>response.json())
      .then((data)=> setstat(data.ResponseCode))
      .catch((error) => {
        console.error('Error Fetching Data: ', error);
      });
    }
  }


  const fcolumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Plaza Name',
        size: 350,
      },
      {
        accessorKey: 'addr',
        header: 'Address',
        size: 350,
      },
      {
        accessorKey: 'valid_from', 
        header: 'Valid From',
        size: 300,
      },
      {
        accessorKey: 'valid_to',
        header: 'Valid To',
        size: 350,
      },
    ],
    [],
  );

  // const testting = () => {
  //   const checkdate = new Date('2024-03-18');
  //   checkdate.setDate(checkdate.getDate() + 1);
  //   const formattedDate = checkdate.toISOString().slice(0, 10);
  //   console.log(formattedDate);
  // }



  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', //access nested data with dot notation
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'addr',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'valid_from', //normal accessorKey
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'valid_to',
        header: 'City',
        size: 150,
      },
    ],
    [],
  );
  // console.log(typeof(columns));
  useEffect(() => {

    const dataitem = localStorage.getItem('encryptedData');
    if(dataitem === null){
      window.location.href='/';
    }else{
      setshowinfo(true);
    }

    if(cstat=='403'){
      window.location.href='/';
    }

    // checkstatus();
    const refresh = setInterval(checkstatus,300000);
    // stat api
    fetch(api+'getstat')
      .then((response) => response.json())
      .then((data) => {
        // setPlazas(data);
        // console.log(data.data);
        settotalcoll(data.data.total_collection_sum);
        setexpense(data.data.Expense);
        setfst(data.data.fast);
        setplaza(data.data.plaza);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // collection api
      fetch(api+'detailcoll')
      .then((response) => response.json())
      .then((data) => {
        // setPlazas(data);
        // console.log(data.data);
        setcurrentItems(data.data);
        // settotalcoll(data.data.total_collection_sum);
        // setexpense(data.data.Expense);
        // setfst(data.data.fast);
        // setplaza(data.data.plaza);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // expense api
      fetch(api+'detailexp')
      .then((response) => response.json())
      .then((data) => {
        // setPlazas(data);
        // console.log(data.data);
        setcurrentItems1(data.data);
        // settotalcoll(data.data.total_collection_sum);
        // setexpense(data.data.Expense);
        // setfst(data.data.fast);
        // setplaza(data.data.plaza);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);

      // fast tag api
      fetch(api+'detailfst')
      .then((response) => response.json())
      .then((data) => {
        // setPlazas(data);
        // console.log(data.data);
        setcurrentItems2(data.data);
        // settotalcoll(data.data.total_collection_sum);
        // setexpense(data.data.Expense);
        // setfst(data.data.fast);
        // setplaza(data.data.plaza);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // detail plaza
      fetch(api+'detailplaza1')
      .then((response) => response.json())
      .then((data) => {
        setcurrentItems3(data.data);
        // console.log(data.data)
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // monthly sales report
      const currentYear = new Date().getFullYear();
      fetch(api+'monthlysalesamount',{
        method: 'POST',
        body: JSON.stringify({ year: currentYear }),
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
      fetch(api+'monthlyexpemseamount',{
        method: 'POST',
        body: JSON.stringify({ year: currentYear }),
      })
      .then((response) => response.json())
      .then((data) => {
        // setcurrentItems3(data.data);
        // console.log(data.Result);
        setmonthlyexp(data.Result);
        // setmonthlyremi(data.Result);
      })

      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
      // //monthly remittance  reports 
      // fetch(api+'monthlyremitnceamount',{
      //   method: 'POST',
      //   body: JSON.stringify({ year: currentYear }),
      // })
      // .then((response) => response.json())
      // .then((data) => {
      //   // setcurrentItems3(data.data);
      //   console.log(data)
      //   // console.log(data.Result);
      //   setmonthlyremi(data.Result);
      // })

      // .catch((error) => {
      //   console.error('Error fetching options:', error);
      // },[]);





     
  },[cstat]);

 
// test start
const uniqueMonths = [...new Set(monthlysale.map(item => item.month))];

// Map month numbers to month names
const allMonths = uniqueMonths.map(month => {
  const monthNumber = parseInt(month, 10);
  return new Date(2024, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
});
// test end
  // const allMonths = Array.from({ length: 12 }, (_, index) => {
  //   return new Date(2024, index, 1).toLocaleString('default', { month: 'long' });
  // });
  const entriesData = monthlysale.map((item) => parseInt(item.amount));
  // console.log(entriesData)
  const expentry = monthlyexp.map((item)=> parseInt(item.amount));
  console.log(expentry)
  const remientry= monthlyexp.map((item)=> parseInt(item.RemittanceAmount));
  // console.log(remientry)
  const entrydetails = monthlyexp.map((item)=> parseInt(item.entries));

  // const toggleOpen = () => setOpen((cur) => !cur);
  // const toggleOpen1 = () => setOpen1((cur) => !cur);
  // const toggleOpen2 = () => setOpen2((cur) => !cur);
  // const toggleOpen3 = () => setOpen3((cur) => !cur);
  const table1 = () =>{
    setOpen((cur) => !cur);
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
  };
  const table2 = () =>{
    setOpen(false);
    setOpen1((cur)=> !cur);
    setOpen2(false);
    setOpen3(false);

  };
  const table3 = () =>{
    setOpen(false);
    setOpen1(false);
    setOpen2((cur)=>!cur);
    setOpen3(false);
  };
  const table4 = () =>{
    setOpen(false);
    setOpen1(false);
    setOpen2(false);
    setOpen3((cur)=>!cur);
  };

 

  const sortedItems = () => {
    if (sortBy) {
      const sorted = [...currentItems3].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy].localeCompare(b[sortBy]);
        } else {
          return b[sortBy].localeCompare(a[sortBy]);
        }
      });
      return sorted;
    }
    return currentItems3;
  };

  const MonthlySale = {
    type: "bar",
  height: 420,

  series: [
    {
      name: "Collection",
      data: entriesData,
    },
    {
      name: "Expense",
      data: expentry,
    },
    {
      name: "RemittanceAmount",
      data: remientry,
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#388e3c", "#FF0000", "#0000ff"],
    // plotOptions: {
    //   bar: {
    //     columnWidth: "26%",
    //     borderRadius: 10,
    //   },
    // },
    // stroke: {
    //   lineCap: "round",
    // },
    // markers: {
    //   size: 7,
    // },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: allMonths,
    },
  },
};

const entrydetail = {
  type: "line",
  height: 420,
  WidthFull:200,
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
    {showinfo ? 
    <div className="mt-12">
      <div className="mb-12 grid justify-center gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        
      
       
       
            <button  onClick={table1} className="w-[290px]">
                <div className="serviceBox popti">
                    <div className="service-icon justify-center py-1">
                        <i class="ri-dashboard-fill">{React.createElement(BanknotesIcon, {
 className: "w-[50px] h-[60px] items-center ml-[80px]",
                })}</i>
                    </div>
                    <h3 className="title text-blue-gray-600">Total Collection</h3>
                    <div className="font-bold text-[20px]">{formatnum(totalcoll)}</div>
                </div>
                
            </button>
      

      {/* <button onClick={table2}> 
          <StatisticsCard
            key="Expenses"
            title="Expenses"
            icon={React.createElement(ChartBarIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {formatnum(expense)}
          />
         
          </button> */}
         <button  onClick={table2} className="w-[290px]">
                <div className="serviceBox popti">
                    <div className="service-icon justify-center py-1">
                        <i>{React.createElement(ChartBarIcon, {
               className: "w-[50px] h-[60px] items-center ml-[80px]",
                })}</i>
                    </div>
                    <h3 className="title text-blue-gray-600">Expenses</h3>
                    <div className="font-bold text-[20px]">{formatnum(expense)}</div>
                </div>
                
            </button>


          
          {/* <button onClick={table3} >
          <StatisticsCard
            key="Fast Tag"
            title="Fast Tag Collection"
            icon={React.createElement(TicketIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {formatnum(fst)}
          />
          </button> */}
          <button  onClick={table3} className="w-[290px]">
                <div className="serviceBox popti">
                    <div className="service-icon justify-center py-1">
                        <i>{React.createElement(TicketIcon, {
              className: "w-[50px] h-[60px] items-center ml-[80px]",
                })}</i>
                    </div>
                    <h3 className="title text-blue-gray-600">Fast Tag Collection</h3>
                    <div className="font-bold">{formatnum(fst)}</div>
                </div>
                
            </button>
          {/* <button  onClick={table4}>
          <StatisticsCard
            key="plaza"
            title="Active Plaza"
            icon={React.createElement(BuildingStorefrontIcon, {
              className: "w-6 h-6 text-white",
            })}
            value = {plaza}
          />
          </button> */}
          <button  onClick={table4} className="w-[290px]">
                <div className="serviceBox popti">
                    <div className="service-icon justify-center py-1">
                        <i>{React.createElement(BuildingStorefrontIcon, {
                className: "w-[50px] h-[60px] items-center ml-[80px]",
                })}</i>
                    </div>
                    <h2 className="title text-blue-gray-600 ">Active Plaza</h2>
                    <div className="font-bold text-[20px]">{formatnum(plaza)}</div>
                </div>
                
            </button>
        
      </div>

      <div className="mt-[-48px] mb-12 w-full ">
      {/* grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-2  */}
      <Collapse open={open}>
        <Card className="my-4 mx-auto w-10/12">
        <CardBody className=" px-0 pt-0 pb-2">
            <table className="w-full w-10/11 table-auto">
              <thead className="bg-blue-600">
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold ml-11 uppercase text-black -blue-gray-400 text-left ">
                     Plaza Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5  text-left">
                    <Typography variant="small" className="text-[14px] font-bold uppercase text-black -blue-gray-400 text-right">
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
                    <tr key={name} className="even:bg-blue-gray-50/50">
                      <td className={className}>
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-center  "
                            >
                              {name.toUpperCase()}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold pr-5 text-blue-gray-600 text-right">
                          {formatnum(total_collection)}
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
        <Card className="my-4 mx-auto w-10/12">
        <CardBody className=" px-0 pt-0 pb-2">
            <table className="w-full w-10/11 table-auto">
              <thead className="bg-blue-600">
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] ml-11 font-bold uppercase text-black  -blue-gray-400 text-left ">
                     Plaza Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase  mr-5 text-black   -blue-gray-400 text-right">
                      Total Expenses
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems1.map(({ name, total_collection }, key) => {
                  const className = `py-3 px-5 ml-10 ${
                    key === currentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center  gap-4 text-center">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-center"
                            >
                              {name.toUpperCase()}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 ml-5 text-right">
                          {formatnum(total_collection)}
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
      <Collapse open={open2}>
        <Card className="my-4 mx-auto w-10/12">
        <CardBody className=" px-0 pt-0 pb-2">
            <table className="w-full w-10/11 table-auto border rounded-lg">
              <thead className="bg-blue-600">
                <tr >
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] mr-20 font-bold uppercase text-black text-center">
                     Plaza Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black text-right">
                      Total Fast Tag Collection
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems2.map(({ name, total_collection }, key) => {
                  const className = `py-3 px-5 ${
                    key === currentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name} className="even:bg-blue-gray-50/50">
                      <td className={className}>
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold text-center"
                            >
                              {name.toUpperCase()}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 text-right">
                          {formatnum(total_collection)}
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
      <Collapse open={open3}>
        <Card className="my-4 mx-auto  w-10/12">
        <CardBody className=" flex px-0 pt-0 pb-2">
       
            <table className="w-full  w-10/11 table-auto">
              <thead className="bg-blue-600">
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black  text-center">
                     Plaza Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black text-right">
                      Address
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black text-right">
                      Valid From
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black text-right">
                      Valid To
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-black text-right">
                      Plaza Type
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems3.map(({ name, addr,valid_from,valid_to,ptype }, key) => {
                  const className = `py-3 px-5 ${
                    key === currentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name} className="even:bg-blue-gray-50/50">
                      <td className={className}>
                        <div className="flex items-center gap-4 ">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold  text-nowrap"
                            >
                              {name.toUpperCase()}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 text-right">
                          {addr.toUpperCase()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 text-right">
                          {fdate(valid_from)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 text-right">
                          {fdate(valid_to)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs  text-blue-gray-600 text-right font-extrabold">
                          {ptype == 1?'Regular':'Limited'}
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
      </div>
      
      <div className="mb-6  flex-wrap  flex-row grid grid-cols-1 gap-y-12 gap-x-10 md:grid-cols-2 xl:grid-cols-2">
      {/* <div className="mb-6 flex-wrap flex-cols-2 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2"> */}
        {/* <Card> */}
        <div>
        <StatisticsChart
        key = 'ChartData'
        color="white" 
        description="MonthWise Expenses"
        title = "Monthly Collection and Expenses"
        chart ={MonthlySale} 
        />
        </div>
       
        

        <div className="ml-5">
       <StatisticsChart
        key = 'Daily Sales1'
        color="white" 
        description = "MonthWise Entries "
        title = "Monthly Entries"
        chart ={entrydetail} 
        />
        </div>
              {/* <StatisticsChart
        key = 'remitance'
        color="white" 
        description="MonthWise Expenses"
        title = "Monthly  Remitance"
        chart ={} 
        /> */}
        </div>
      </div>
    
    : <div></div>}
    </>
  );
}

export default Home;



