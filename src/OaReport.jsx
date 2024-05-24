import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";

import {
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import api from './ApiLink.mjs';
import * as ExcelJS from 'exceljs';

const PAGE_SIZE = 50;

const TABLE_HEAD = ["Sr no","TOLL PLAZA", "Closing Balance"];
const TABLE_HEAD1 = ["Sr no", "Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM", "balaji", "Monthly Pass Amount", "GROSS CASH RECEIVABLE FROM TOLL PLAZA", "TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS", "TOTAL RECEPTS FROM TC", "SHORT/EXCESS COLLECTION FROM TC", "CASH DEPOSITED DIRECTLY TO BANK", "CASH DEPOSITED IN ARCPL OFFICE", "CASH KEPT FOR EXPENSES", "DIFFERENCE CASH IN TOLL PLAZA", "TOTAL FAST TAG COLLECTION", "SHORT AMOUNT ADJUSTMENT", "EXCESS AMOUNT ADJUSTMENT", "TOTAL FAST TAG RECEIVABLE", "FAST TAG AMOUNT TRANSFER TO BANK A/C", "DIFFERENCE RECEIVABLE", "TOTAL COLLECTION", "Operator"];




export default function OaReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [plazas, setPlazas] = useState([]);
  const [showTable, setshowTable] = useState(false);
  const [showTable1, setshowTable1] = useState(false);
  const [TABLE_ROWS, setrows] = useState([]);
  const [genrep, setgenrep] = useState([]);
  const [excrep, setexcrep] = useState(false);
  const [plazaremrep, setplazaremrep] = useState(false);
  const [edit, setedit] = useState(false);
  const [TABLE_ROWS1,setrow] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date:currentDate,
  });

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const displayedRows = TABLE_ROWS1.slice(startIdx, endIdx);
  
  const displayedRows1 = TABLE_ROWS1.slice(startIdx, endIdx);

  const totalPages = Math.ceil(TABLE_ROWS1.length / PAGE_SIZE);
// console.log(displayedRows1);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
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
    const data = decryptAndRetrieveData("Harry");
    // console.log(data.user.rid);
    if (data.user.rid == '4') {
      setedit(true);
    } else {
      if(data.user.rid=='2'){
        setedit(true);
      }else{
      window.location.href = '/';
      }
    }
    
    fetch(api + 'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        setPlazas(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      }, []);
  }, [setPlazas, excrep,plazaremrep]);

  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePlazaChange = (value) => {
    // console.log(e.target.value);
    setFormData({
      ...formData,
      plaza_code: value,
    });
  };

  const handleGetResult = async (e) => {
    e.preventDefault();
    // console.log('Get Result clicked', formData);
    setshowTable1(false);
    const res = await fetch(api + 'generate_remireport', {
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
    }).then(resp => resp.json())
      .then(data => setrows(data.Data));
    setshowTable(true);
    // console.log(TABLE_ROWS);

  };

  const handleday = (value) => {
    const newdate = new Date(value);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[newdate.getDay()];
    // console.log(dayOfWeek);
    return dayOfWeek;
  }

  const handlefromremi = async(e) =>{
    e.preventDefault();
    
    setshowTable(false);
    const res = await fetch(api+'all_plaza_opening',{
      method:"POST",
      body:JSON.stringify(formData)
    })
    if(res.ok){
      const data = await res.json();
      console.log(data);
      setrow(data);
      // const newPlazaTotals = [];
      // data.Data.forEach((entry) => {
      //   const plaza_id = entry.plaza_id;
      //   const name = entry.name;
      //   const total_coll = parseFloat(entry.total_coll);
      //   const remitance = parseFloat(entry.remitance);

      //   if (!(plaza_id in newPlazaTotals)) {
      //     newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remitance: 0.0 };
      //   }

      //   newPlazaTotals[plaza_id].total_coll += total_coll;
      //   newPlazaTotals[plaza_id].remitance += remitance;
      // });

      // const newPlazaTotals = data.Data.map((entry) => {
      //   return {
      //     plaza_id: entry.plaza_id,
      //     name: entry.name,
      //     total_coll: parseFloat(entry.total_coll),
      //     remitance: parseFloat(entry.remitance),
      //   };
      // });
      // console.log(data.Data);
//       const newPlazaTotals = {};

//     data.Data.forEach((entry) => {
//       const plaza_id = entry.plaza_id;
//       const name = entry.name;
//       const total_coll = parseFloat(entry.total_coll);
//       const remittance = parseFloat(entry.remittance);

//       if (!(plaza_id in newPlazaTotals)) {
//         newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 };
//       }

//       newPlazaTotals[plaza_id].total_coll += total_coll;
//       newPlazaTotals[plaza_id].remittance += remittance;
//     });

//     const plazaTotalsArray = Object.values(newPlazaTotals);
//     plazaTotalsArray.sort((a, b) => {
//       const nameA = a.name.toUpperCase(); 
//       const nameB = b.name.toUpperCase(); 
  
//       if (nameA < nameB) {
//           return -1;
//       }
//       if (nameA > nameB) {
//           return 1;
//       }
  
//       return 0; 
//   });
  
//     console.log(plazaTotalsArray)
//     setrow(plazaTotalsArray);
    setshowTable1(true);
  
      

    }
  }

  const resetform = async(e) =>{
    setFormData({
      date:currentDate,
    });
    setshowTable(false);
    setshowTable1(false);
  }
  const GenerateReport = async (e) => {
    e.preventDefault();
    if( formData.plaza_code === null){
      // console.log('Get Result clicked', formData);
    const res = await fetch(api + 'fremi', {
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
    });
    if(res.ok){
      const data = await res.json();
      
      const newPlazaTotals = {};

    data.Data.forEach((entry) => {
      const plaza_id = entry.plaza_id;
      const name = entry.name;
      const total_coll = parseFloat(entry.total_coll);
      const remittance = parseFloat(entry.remitance);

      if (!(plaza_id in newPlazaTotals)) {
        newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 };
      }

      newPlazaTotals[plaza_id].total_coll += total_coll;
      newPlazaTotals[plaza_id].remittance += remittance;
    });

    // Convert the object to an array if needed
    const plazaTotalsArray = Object.values(newPlazaTotals);

    // console.log(plazaTotalsArray);
    // setrow(plazaTotalsArray);
    // setshowTable1(true);
    setgenrep(plazaTotalsArray);
  
      
      setexcrep(true);
    }
       
    }else{
      // console.log('Get Result clicked', formData);
    const res = await fetch(api + 'all_plaza_opening', {
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
    });
    if(res.ok){
      const data = await res.json();
      console.log(data);
    //   const newPlazaTotals = {};

    // data.Data.forEach((entry) => {
    //   const plaza_id = entry.plaza_id;
    //   const name = entry.name;
    //   const total_coll = parseFloat(entry.total_coll);
    //   const remittance = parseFloat(entry.remitance);

    //   if (!(plaza_id in newPlazaTotals)) {
    //     newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 };
    //   }

    //   newPlazaTotals[plaza_id].total_coll += total_coll;
    //   newPlazaTotals[plaza_id].remittance += remittance;
    // });

    
    // const plazaTotalsArray = Object.values(newPlazaTotals);

    
    // setgenrep(plazaTotalsArray);
  
      
    //   setplazaremrep(true);
    }
       
   
  }
  };

  // const sl = () =>{



  // plazawise report start
  
  // plazawise report end

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className='bg-gray-100 h-[100%]'>
        {/* <NavBar/> */}
        {/* <div className='flex'> */}
        {/* <SideNav/> */}
        <div className='m-5'>
          <div className=' my-5'>
            <form onSubmit={handleSubmit}>
              {/* <div className='flex'> */}
              <div className='flex flex-row '>
                <div className="text-[20px] mt-[5px]"> Date </div>
                <div className=" w-[200px] px-5">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
                      required
                      value={formData.date}
                      onChange={(e) => { handleDateChange("date", e.target.value) }}
                    />

                  </div>
                </div>
                {/* <div className="text-[20px] mt-[5px]"> To </div>
                <div className=" w-[200px] px-5">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
                      required
                      onChange={(e) => { handleDateChange("to", e.target.value) }}
                      value={formData.to}
                    />
                  </div>
                </div> */}
                
                {/* <Button className='mx-5' color='blue'>Get Result</Button> */}
                {/* <Button className='mx-5' color='blue' onClick={handleGetResult}>
                  Get Day Wise Result
                </Button> */}
                <Button className='mx-5' color='blue' onClick={handlefromremi}>
                  Get Result
                </Button>
                {/* <Button color='green' onClick={GenerateReport}>Generate Report</Button> */}
                <ArrowPathIcon
                className=' mt-[2px] ml-2 h-10 cursor-pointer'
                onClick={resetform}
                />
              </div>

              {/* </div> */}
            </form>
          </div>
          {/* { showTable ?():<div></div> } */}
          {/* Table starts */}
          {showTable ? (
            <div className='w-[90%]'>
              <div className="overflow-x-auto w-[100%]">
                <Card className="h-full w-full overflow-scroll">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      {edit ? (
                        <tr>
                          {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[30px]">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70 text-center"
                              >
                                {head}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      ) :
                        <tr>
                          {TABLE_HEAD1.map((head) => (
                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[30px] flex justify-center items-center">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70 text-center"
                              >
                                {head}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      }
                    </thead>
                    <tbody>
                      {displayedRows.map(({ name, oa }, index) => (
                        <tr key={plaza_id} className="even:bg-blue-gray-50/50 ">
                          {/* <td className="p-4 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {index + 1}
                            </Typography>
                          </td> */}
                          <td className="p-4 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {name}
                            </Typography>
                          </td>
                          <td className="p-4 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {oa}
                            </Typography>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                    
                  </table>
                  
                  
                </Card>
              </div>
            </div>
          ) : null}
          {/* Table ends */}
          {/* Second table start*/}
          {showTable1 ? (
            <div className='w-[90%]'>
              <div className="overflow-x-auto ">
                <Card className="h-full ">
                  <table className="table-auto  text-left ">
                  {/* text-left */}
                    <thead>
                      {edit ? (
                        <tr>
                          {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 py-2 w-[5px]">
                              <div className="font-normal leading-none opacity-70 text-center text-blue-gray-700">
                                {head} 
                                </div>
                            </th>
                          ))}
                        </tr>
                      ) :
                        <tr>
                          {TABLE_HEAD1.map((head) => (
                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-1 w-[10px] flex justify-center items-center">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70 text-center"
                              >
                                {head}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      }
                    </thead>
                    <tbody>
                      {displayedRows1.map(({ name,oa ,plaza_id}, index) => (
                        <tr key={plaza_id} className="even:bg-blue-gray-50/50 ">
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {index + 1}
                            </Typography>
                          </td>
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {name}
                            </Typography>
                          </td>
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal text-right">
                              {oa}
                            </Typography>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <td> Total</td>
                      <td></td>
                      <td className='text-right'>{displayedRows1.reduce((sum ,{ oa }) => parseFloat(parseFloat(sum) + parseFloat(oa)).toFixed(2),0 )}</td>
                    </tfoot>
                  </table> 
                </Card>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
    </>
  );
}
