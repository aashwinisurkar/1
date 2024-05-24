import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";

import {
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import api from './ApiLink.mjs';
import * as ExcelJS from 'exceljs';

const PAGE_SIZE = 50;

const TABLE_HEAD = ["Sr no","TOLL PLAZA", "TOTAL COLLECTION", "REMITTANCE", "MARGIN WITHOUT EXP."];
// const TABLE_HEAD1 = ["Sr no", "Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM", "balaji", "Monthly Pass Amount", "GROSS CASH RECEIVABLE FROM TOLL PLAZA", "TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS", "TOTAL RECEPTS FROM TC", "SHORT/EXCESS COLLECTION FROM TC", "CASH DEPOSITED DIRECTLY TO BANK", "CASH DEPOSITED IN ARCPL OFFICE", "CASH KEPT FOR EXPENSES", "DIFFERENCE CASH IN TOLL PLAZA", "TOTAL FAST TAG COLLECTION", "SHORT AMOUNT ADJUSTMENT", "EXCESS AMOUNT ADJUSTMENT", "TOTAL FAST TAG RECEIVABLE", "FAST TAG AMOUNT TRANSFER TO BANK A/C", "DIFFERENCE RECEIVABLE", "TOTAL COLLECTION", "Operator"];
const TABLE_HEAD1 = ["Sr no","DATE", "TOTAL COLLECTION", "REMITTANCE", "MARGIN WITHOUT EXP."];



export default function RemiReport() {
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
    plaza_code: null,
    to: currentDate,
    from: currentDate,
    date: currentDate,
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
    if (excrep) {
      gen();
      setexcrep(!excrep);
    }
    if(plazaremrep){
      gen1();
      setplazaremrep(!plazaremrep);
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
    if(!value){
      setFormData({
        ...formData,
        plaza_code: null,
      });
    }
    setshowTable(false);
    setshowTable1(false);

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
    // const res = await fetch(api + 'fremi', {
    //   method: "POST",
    //   //mode: 'no-cors',
    //   body: JSON.stringify(formData)
    // }).then(resp => resp.json())
    //   .then(data => setrows(data.Data));
    // setshowTable(true);
    setshowTable(false);
    const res = await fetch(api+'fremi',{
      method:"POST",
      body:JSON.stringify(formData)
    })
    if(res.ok){
      const data = await res.json();
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
      const newPlazaTotals = {};
if(formData.plaza_code===null){
    data.Data.forEach((entry) => {
      const plaza_id = entry.plaza_id;
      const name = entry.name;
      const total_coll = parseFloat(entry.total_coll);
      const remittance = parseFloat(entry.remittance);

      if (!(plaza_id in newPlazaTotals)) {
        newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 };
      }

      newPlazaTotals[plaza_id].total_coll += total_coll;
      newPlazaTotals[plaza_id].remittance += remittance;
    });

    // Convert the object to an array if needed
    const plazaTotalsArray = Object.values(newPlazaTotals);
    plazaTotalsArray.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // Ignore case
      const nameB = b.name.toUpperCase(); // Ignore case
  
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
  
      return 0; // Names are equal
  });
  
  // console.log(plazaTotalsArray);
    console.log(plazaTotalsArray)
    // console.log(plazaTotalsArray);
    setrow(plazaTotalsArray);
  }else{
    setrow(data.Data);
  }
    setshowTable1(true);
  
      // console.log(newPlazaTotals);
      // setrow(newPlazaTotals);
      // setshowTable1(true);
      

      // console.log(newPlazaTotals);
      // setrow(newPlazaTotals);
      // setshowTable1(true);

    }
  }

  const resetform = async(e) =>{
    setFormData({
      from:currentDate,
      to:currentDate,
      plaza_code: null,
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
      if(formData.plaza_code === null){

      
      const newPlazaTotals = {};

    data.Data.forEach((entry) => {
      const plaza_id = entry.plaza_id;
      const name = entry.name;
      const total_coll = parseFloat(entry.total_coll);
      const remittance = parseFloat(entry.remittance);

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
  }else{
    setgenrep(data.Data);
  }
  
      
      setexcrep(true);
    }
       
    }else{
      // console.log('Get Result clicked', formData);
    const res = await fetch(api + 'fremi', {
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
    });
    if(res.ok){
      const data = await res.json();
      
      const newPlazaTotals = {};
      if(formData.plaza_code===null){
        console.log("hi");
      
    data.Data.forEach((entry) => {
      const plaza_id = entry.plaza_id;
      const name = entry.name;
      const total_coll = parseFloat(entry.total_coll);
      const remittance = parseFloat(entry.remittance);

      if (!(plaza_id in newPlazaTotals)) {
        newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 };
      }

      newPlazaTotals[plaza_id].total_coll += total_coll;
      newPlazaTotals[plaza_id].remittance += remittance;
    });

    
    const plazaTotalsArray = Object.values(newPlazaTotals);

    
    setgenrep(plazaTotalsArray);
  }else{
    setgenrep(data.Data);
  }
  
      
      setplazaremrep(true);
    }
       
   
  }
  };

  // const sl = () =>{

  // }
  const gen = () => {
    // setTimeout(gen, 8000);
    // console.log(genrep);
    // if(genrep.length !== 0){
    // console.log("inside");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headingCell = worksheet.getCell('A1');
    headingCell.value = 'M/S ASHMI ROAD CARRIERS PVT LTD';
    headingCell.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A1:D1');
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' };   
    const headingCell1 = worksheet.getCell('A2');
    const fromdate = new Date(formData.from);
    const fromDatep = `${fromdate.getDate()}-${fromdate.toLocaleString('default', { month: 'short' }).toUpperCase()}-${fromdate.getFullYear()}`;
    const todate = new Date(formData.to);
    const toDatep = `${todate.getDate()}-${todate.toLocaleString('default', { month: 'short' }).toUpperCase()}-${todate.getFullYear()}`;
    headingCell1.value = 'From: '+`${fromDatep}`+'  '+'To: '+`${toDatep}`;
    headingCell1.font = {bold:true,size:12};
    worksheet.mergeCells('A2:D2');
    headingCell1.alignment = { vertical: 'middle', horizontal: 'center' };  

    

    const headingNames = [
        'TOLL PLAZA', 'TOTAL COLLECTION', 'REMITTANCE', 'MARGIN WITHOUT EXPENSES'];

    const hn = [
      'name','total_coll','remittance'
    ];

    for (let i = 0; i < headingNames.length; i++) {
        if(i ===14 || i === 21){
            continue;
        }
        const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}3`); // A=65, B=66, ..., W=87
        cell.value = headingNames[i];
        cell.font = { bold: true, size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow background color, you can change it as needed
              };

        

        const cellcol = worksheet.getColumn(`${String.fromCharCode(65 + i)}`);
        cellcol.width = 14;

        if(i>=0 && i<=33){
        cellcol.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
    }

        // const crow = worksheet.getRow(4);
        // crow.height=180;
      }

    for (let i = 0; i < genrep.length; i++) {
      const rowData = genrep[i];
    for (let j = 0; j < headingNames.length; j++) {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + j)}${i + 4}`);
      // console.log(headingNames[j]);
    
      if (hn[j] === 'name') {
        cell.value = rowData[hn[j]].toUpperCase();
      } else {
        if (headingNames[j] === 'MARGIN WITHOUT EXPENSES') {
          // Subtract 'total_coll' from 'remittance' and set the value in the new column
          // cell.value = parseFloat(rowData['total_coll']) - parseFloat(rowData['remittance']) ;
          const marginValue = parseFloat(rowData['total_coll']) - parseFloat(rowData['remittance']);
        cell.value = marginValue;

        // Set font color based on the sign of the marginValue
        cell.font = { color: marginValue >= 0 ? { argb: 'FF00FF00' } : { argb: 'FFFF0000' } };
        } else {
          cell.value = parseFloat(rowData[hn[j]]);
        }
      }
    }
  }
  
    // detail entry end
    // total start
    const columnTotals = Array(headingNames.length).fill(0);
  for (let i = 0; i < genrep.length; i++) {
    const rowData = genrep[i];
    for (let j = 0; j < headingNames.length; j++) {
      if(j == 0){
        columnTotals[j] = 'Total';
      }
      if (hn[j] !== 'name') {
        columnTotals[j] += parseFloat(rowData[hn[j]]) || 0;
      }
    }
  }

  const totalRow = worksheet.addRow();
  for (let j = 0; j < headingNames.length; j++) {
    const cell = totalRow.getCell(`${String.fromCharCode(65 + j)}`);
    cell.value = columnTotals[j];
    cell.font = { bold: true };
  }
  const totalCollection = columnTotals[1];
  const totalRemittance = columnTotals[2];
  const difference = totalCollection - totalRemittance;

  const differenceCell = totalRow.getCell('D'); 
  differenceCell.value = difference;
  differenceCell.font = { bold: true, color: difference >= 0 ? { argb: 'FF00FF00' } : { argb: 'FFFF0000' } };
    // total end
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to a Blob and create a URL
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      // window.open(url, '_blank');
      // Create a link and trigger a click to start the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'All_Plaza_Remittance_Report.xlsx';
      a.click();

      // Release the URL object
      URL.revokeObjectURL(url);
    });
    // }else{
    //   console.log("else");
    //   // GenerateReport(0);
    //   // gen();

    // }
  }

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }

  // plazawise report start
  const gen1 = () => {
    // setTimeout(gen, 8000);
    // console.log(genrep);
    // if(genrep.length !== 0){
    // console.log("inside");

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headingCell = worksheet.getCell('A1');
    headingCell.value = 'M/S ASHMI ROAD CARRIERS PVT LTD';
    headingCell.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A1:D1');
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' };   
    const headingCell1 = worksheet.getCell('A2');
    const fromdate = new Date(formData.from);
    const fromDatep = `${fromdate.getDate()}-${fromdate.toLocaleString('default', { month: 'short' }).toUpperCase()}-${fromdate.getFullYear()}`;
    const todate = new Date(formData.to);
    const toDatep = `${todate.getDate()}-${todate.toLocaleString('default', { month: 'short' }).toUpperCase()}-${todate.getFullYear()}`;
    headingCell1.value = 'From: '+`${fromDatep}`+'  '+'To: '+`${toDatep}`;
    headingCell1.font = {bold:true,size:12};
    worksheet.mergeCells('A2:D2');
    headingCell1.alignment = { vertical: 'middle', horizontal: 'center' };  

    

    const headingNames = [
        'TOLL PLAZA', 'TOTAL COLLECTION', 'REMITTANCE', 'MARGIN WITHOUT EXPENSES'];

    const hn = [
      'name','total_coll','remittance'
    ];

    for (let i = 0; i < headingNames.length; i++) {
        if(i ===14 || i === 21){
            continue;
        }
        const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}3`); // A=65, B=66, ..., W=87
        if(headingNames[i]==='TOLL PLAZA' && formData.plaza_code!=null){
          cell.value = 'DATE';
        }else{
        cell.value = headingNames[i];
        }
        cell.font = { bold: true, size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // Yellow background color, you can change it as needed
              };

        

        const cellcol = worksheet.getColumn(`${String.fromCharCode(65 + i)}`);
        cellcol.width = 14;

        if(i>=0 && i<=33){
        cellcol.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
      };
    }

        // const crow = worksheet.getRow(4);
        // crow.height=180;
      }

    for (let i = 0; i < genrep.length; i++) {
      const rowData = genrep[i];
    for (let j = 0; j < headingNames.length; j++) {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + j)}${i + 4}`);
      // console.log(headingNames[j]);
    
      if (hn[j] === 'name') {
        if(formData.plaza_code===null){
        cell.value = rowData[hn[j]].toUpperCase();
        }else{
          cell.value = fdate(rowData['date_rep']);
        }
      } else {
        if (headingNames[j] === 'MARGIN WITHOUT EXPENSES') {
          // Subtract 'total_coll' from 'remittance' and set the value in the new column
          // cell.value = parseFloat(rowData['total_coll']) - parseFloat(rowData['remittance']) ;
          const marginValue = parseFloat(rowData['total_coll']) - parseFloat(rowData['remittance']);
        cell.value = marginValue;

        // Set font color based on the sign of the marginValue
        cell.font = { color: marginValue >= 0 ? { argb: 'FF00FF00' } : { argb: 'FFFF0000' } };
        } else {
          cell.value = parseFloat(rowData[hn[j]]);
        }
      }
    }
  }
  
    // detail entry end
    // total start
    const columnTotals = Array(headingNames.length).fill(0);
  for (let i = 0; i < genrep.length; i++) {
    const rowData = genrep[i];
    for (let j = 0; j < headingNames.length; j++) {
      if(j == 0){
        columnTotals[j] = 'Total';
      }
      if (hn[j] !== 'name') {
        columnTotals[j] += parseFloat(rowData[hn[j]]) || 0;
      }
    }
  }

  const totalRow = worksheet.addRow();
  for (let j = 0; j < headingNames.length; j++) {
    const cell = totalRow.getCell(`${String.fromCharCode(65 + j)}`);
    cell.value = columnTotals[j];
    cell.font = { bold: true };
  }
  const totalCollection = columnTotals[1];
  const totalRemittance = columnTotals[2];
  const difference = totalCollection - totalRemittance;

  const differenceCell = totalRow.getCell('D'); 
  differenceCell.value = difference;
  differenceCell.font = { bold: true, color: difference >= 0 ? { argb: 'FF00FF00' } : { argb: 'FFFF0000' } };
    // total end
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to a Blob and create a URL
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      // window.open(url, '_blank');
      // Create a link and trigger a click to start the download
      const name = genrep[0];
      // console.log("hi",name['name']);
      const pname = name['name'];
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pname}`+'_reminttance_report.xlsx';
      a.click();

      // Release the URL object
      URL.revokeObjectURL(url);
    });
    // }else{
    //   console.log("else");
    //   // GenerateReport(0);
    //   // gen();

    // }
  }
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
                <div className="text-[20px] mt-[5px]"> From </div>
                <div className=" w-[200px] px-5">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
                      required
                      value={formData.from}
                      onChange={(e) => { handleDateChange("from", e.target.value) }}
                    />

                  </div>
                </div>
                <div className="text-[20px] mt-[5px]"> To </div>
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
                    {/* onChange={(e) =>{handleDateChange("test", e.target.value)}} */}
                  </div>
                </div>
                <div className='mt-[5px]'>
                  <select label="Choose Plaza"
                    onChange={(e) => handlePlazaChange(e.target.value)}
                    value={formData.plaza_code === null ? '' : formData.plaza_code}  
                    className="w-[200px] border border-gray-300 rounded-md p-2"
                  >
                    {/* <Option key=''></Option> */}
                    {/* <Option></Option> */}
                    <option value="" >Select Plaza</option>
                    {plazas.map((plaza) => (
                      <option  value={plaza.plaza_id}>
                        {plaza.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <Button className='mx-5' color='blue'>Get Result</Button> */}
                {/* <Button className='mx-5' color='blue' onClick={handleGetResult}>
                  Get Day Wise Result
                </Button> */}
                <Button className='mx-5' color='blue' onClick={handlefromremi}>
                  Get Datewise Result
                </Button>
                <Button color='green' onClick={GenerateReport}>Generate Report</Button>
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
                      {formData.plaza_code === null ? (
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
                      {displayedRows.map(({ date_rep, name, remittance, monthly_pass_amt, total_coll, plaza_id }, index) => (
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
                              {total_coll}
                            </Typography>
                          </td>
                          <td className="p-4 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal text-center">
                              {remittance}
                            </Typography>
                          </td>
                          <td className="p-4 border-2 font-extrabold">
                            <Typography variant="small" color="blue-gray" className={total_coll - remitance > 0 ? "text-green-600 text-center font-bold" : "text-red-800 text-center font-bold"}>
                              {total_coll - remittance}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {/* <tfoot>
                      <tr>
                        <td  className='p-4 border-2 text-left font-bold'>
                          Total 
                        </td>
                        
                        <td></td>
                        <td className='p-4 border-2 text-center font-bold'>
                          {displayedRows.reduce((sum ,{ total_coll }) => parseFloat(parseFloat(sum) + parseFloat(total_coll)).toFixed(2),0 )}
                        </td>
                        <td className='p-4 border-2 text-center font-bold'>
                          {displayedRows.reduce((sum,{remitance}) => parseFloat(parseFloat(sum) + parseFloat(remitance)).toFixed(2),0)}
                        </td>
                        <td className={displayedRows.reduce((sum,{total_coll,remitance}) => sum + (total_coll-remitance),0) > 0 ? "p-4 border-2 text-center font-bold text-green-700":"p-4 border-2 text-center font-bold text-red-700"}>
                          {displayedRows.reduce((sum,{total_coll,remitance}) => sum + (total_coll-remitance),0)}
                        </td>
                      </tr>
                    </tfoot> */}
                  </table>
                  {/* <div className='flex justify-center m-2'>
                    <Typography variant="small" color="blue-gray" className="mr-2">
                      Page {currentPage} of {totalPages}
                    </Typography>
                  </div> */}
                  <div className="flex justify-center p-4">

                    {/* {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => changePage(index + 1)}
                className={`mr-2 px-2 py-1 rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-blue-200'
                }`}
              >
                {index + 1}
              </button>
            ))} */}
                    {/* <button
                      onClick={goToPrevPage}
                      className={`mr-2 px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
                        }`}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={goToNextPage}
                      className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
                        }`}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button> */}
                  </div>
                </Card>
              </div>
            </div>
          ) : null}
          {/* Table ends */}
          {/* Second table start*/}
          {showTable1 ? (
            <div className='w-[90%]'>
              <div className="overflow-x-auto w-[100%]">
                <Card className="h-full w-full">
                  <table className="table-auto w-[100%] text-left ">
                  {/* text-left */}
                    <thead>
                      {formData.plaza_code===null ? (
                        <tr>
                          {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 py-2">
                              {/* <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal leading-none opacity-70 text-center"
                              > */}
                              <div className="font-normal leading-none opacity-70 text-center text-blue-gray-700">
                                {head}
                                </div>
                              {/* </Typography> */}
                            </th>
                          ))}
                        </tr>
                      ) :
                      <tr>
                      {TABLE_HEAD1.map((head) => (
                        <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 py-2">
                          {/* <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70 text-center"
                          > */}
                          <div className="font-normal leading-none opacity-70 text-center text-blue-gray-700">
                            {head}
                            </div>
                          {/* </Typography> */}
                        </th>
                      ))}
                    </tr>
                      }
                    </thead>
                    <tbody>
                      {displayedRows1.map(({ date_rep, name, remittance, monthly_pass_amt, total_coll, plaza_id }, index) => (
                        <tr key={plaza_id} className="even:bg-blue-gray-50/50 ">
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {index + 1}
                            </Typography>
                          </td>
                          {/* <td className="p-1 border-2 text-right"> */}
                          <td className={`${formData.plaza_code===null?'p-1 border-2':'p-1 border-2 text-right'}`}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {formData.plaza_code===null? name:fdate(date_rep)}
                            </Typography>
                          </td>
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal text-right">
                              {total_coll}
                            </Typography>
                          </td>
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className="font-normal text-right">
                              {remittance}
                            </Typography>
                          </td>
                          <td className="p-1 border-2">
                            <Typography variant="small" color="blue-gray" className={total_coll - remittance > 0 ? "text-green-700 text-right font-bold" : "text-red-800 text-right font-bold"}>
                              {total_coll - remittance}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td  className='p-4 border-2 text-left font-bold'>
                          Total 
                        </td>
                        
                        <td  className='p-4 border-2 text-left font-bold'>
                           
                        </td>
                        
                        <td className='p-4 border-2 text-right font-bold'>
                          {displayedRows1.reduce((sum ,{ total_coll }) => parseFloat(parseFloat(sum) + parseFloat(total_coll)).toFixed(2),0 )}
                        </td>
                        <td className='p-4 border-2 text-right font-bold'>
                          {displayedRows1.reduce((sum,{remittance}) => parseFloat(parseFloat(sum) + parseFloat(remittance)).toFixed(2),0)}
                        </td>
                        <td className={displayedRows1.reduce((sum,{total_coll,remittance}) => sum + (total_coll-remittance),0) > 0 ? "p-4 border-2 text-right font-bold text-green-700":"p-4 border-2 text-right font-bold text-red-700"}>
                          {displayedRows1.reduce((sum,{total_coll,remittance}) => sum + (total_coll-remittance),0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  {/* <div className='flex justify-center m-2'>
                    <Typography variant="small" color="blue-gray" className="mr-2">
                      Page {currentPage} of {totalPages}
                    </Typography>
                  </div> */}
                  <div className="flex justify-center p-4">

                    {/* {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => changePage(index + 1)}
                className={`mr-2 px-2 py-1 rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-blue-200'
                }`}
              >
                {index + 1}
              </button>
            ))} */}
                    {/* <button
                      onClick={goToPrevPage}
                      className={`mr-2 px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
                        }`}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={goToNextPage}
                      className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
                        }`}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button> */}
                  </div>
                </Card>
              </div>
            </div>
          ) : null}
          {/* second table end */}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
