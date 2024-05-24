import React, { useState,useEffect } from 'react';
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";

import {
  PencilSquareIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import api from './ApiLink.mjs';
import * as ExcelJS from 'exceljs';
import UpdatePlazareport from './UpdatePlazareport';
import Updateplazapreport from './Updateplazapreport';

const PAGE_SIZE = 1;

// const TABLE_HEAD = ["Sr no","Date", "WeekDay","Cash 1", "Cash 2","Monthly Pass Amount","GROSS CASH collection","FAST TAG COLLECTION","TOTAL COLLECTION","expense paid fro h.o","expense paid from toll plaza","TOTAL EXPENSES","Net Collection","Non Fastag Cash penalty","Agreed remittance","margin without expenses","profit/loss agreed remittance incl expense","%Collection up/down w.r.t Agreed remittance","TCS @2%"];
const TABLE_HEAD = ["Sr no","Toll Plaza Name","Remittance","TCS","TOTAL","NON FASTTAG CASH PENALTY","TCS ","TOTAL ","GRAND TOTAL","TOTAL COLLECTION"];
// ,"ACTIONS"
const TABLE_HEAD1 = ["Sr no","Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM","balaji","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","CASH KEPT FOR EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","SHORT AMOUNT ADJUSTMENT","EXCESS AMOUNT ADJUSTMENT","TOTAL FAST TAG RECEIVABLE","FAST TAG AMOUNT TRANSFER TO BANK A/C","DIFFERENCE RECEIVABLE","TOTAL COLLECTION","Operator"];




export default function Daily_Rem_Rep() {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [plazas, setPlazas] = useState([]);
  const [showTable,setshowTable] = useState(false);
  const [TABLE_ROWS,setrows] = useState([]);
  const [totalcon,setcon] = useState([]);
  const [genrep,setgenrep] = useState([]);
  const [excrep,setexcrep] = useState(false);
  const [edit,setedit] = useState(false);
  const [report,setreport] = useState([]);
  const [fopn,setopen] = useState(false);
  const [uid,setuid] = useState('');
  const [tcs,settcs] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    plaza_code: '',
    to: currentDate,
    from: currentDate,
  });

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const displayedRows = TABLE_ROWS.slice(startIdx, endIdx);
  // console.log(TABLE_ROWS);
  // const totalPages = Math.ceil(TABLE_ROWS.length / PAGE_SIZE);
  const totalPages = 1;
  
//   console.log(TABLE_ROWS);
  const changePage = (page) => {
    setCurrentPage(page);
  };


  const toggleComponentVisibility = () => {
    setopen(!fopn);
  };
  const gettotal = (value) =>{
    const sums = {
      "cash_1": 0,
      "cash_2": 0,
      "monthly_pass_amount": 0,
      "gross_cash_rec": 0,
      "total_fast_tag_cl": 0,
      "expense_from_tp": 0,
      "total_coll": 0,
      "agreed_remittance": 0,
      "total_expense_from_ho": 0,
      "margin_without_expense": 0
  };
  value.forEach(obj => {
    for (const key in sums) {
        sums[key] += parseFloat(obj[key]) || 0;
    }
});
    // console.log(sums['cash_1']);
    const total_sum = {
      "cash_1": sums['cash_1'],
      "cash_2": sums['cash_2'],
      "monthly_pass_amount": sums['monthly_pass_amount'],
      "gross_cash_rec": sums['gross_cash_rec'],
      "total_fast_tag_cl": sums['total_fast_tag_cl'],
      "expense_from_tp": sums['expense_from_tp'],
      "total_coll": sums['total_coll'],
      "agreed_remittance": sums['agreed_remittance'],
      "total_expense_from_ho": sums['total_expense_from_ho'],
      "margin_without_expense": parseFloat(parseFloat(sums['total_coll'])-parseFloat(sums['agreed_remittance'])),
      "total_exp":parseFloat(parseFloat(sums['total_expense_from_ho'])+parseFloat(sums['expense_from_tp'])),
      "net_coll":parseFloat(sums['total_coll']-parseFloat(parseFloat(sums['total_expense_from_ho'])+parseFloat(sums['expense_from_tp']))),
      "non_fst_tg_pnlty":parseFloat(sums['cash_1']/2),
      "p/l":parseFloat(parseFloat(sums['total_coll'])-parseFloat(sums['agreed_remittance'])-parseFloat(parseFloat(sums['total_expense_from_ho'])+parseFloat(sums['expense_from_tp']))-parseFloat(sums['cash_1']/2)),
      "per":parseFloat(parseFloat(parseFloat(parseFloat(parseFloat(sums['total_coll'])-parseFloat(sums['agreed_remittance']))/parseFloat(sums['agreed_remittance'])))*100).toFixed(2),
      "tcs":parseFloat(parseFloat(parseFloat(sums['cash_1']/2)+parseFloat(sums['agreed_remittance']))*0.02).toFixed(2)
    }
    // console.log(total_sum);
    return total_sum;
  }

  const total_consolidate = gettotal(TABLE_ROWS);
  // console.log(total_consolidate);
  
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
      // setStartIndex((pageNumber - 1) * rowsPerPage);
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
    setuid(data.user.id);
    if(data.user.rid =='4'){
      setedit(true);
    }else{
      if(data.user.rid == '2'){
        setedit(false);
      }else{
      window.location.href = '/';
      }
    }
    if(excrep){
      gen();
      setexcrep(!excrep);
    }
    fetch(api+'gettcs')
      .then((response) => response.json())
      .then((data) => {
        settcs(data[0].value)
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);
  },[setPlazas,excrep]);

  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePlazaChange = (value) => {
    // console.log(value);
    setshowTable(false);
    setFormData({
      ...formData,
      plaza_code: value,
    });
  };

  const handleGetResult = async(e) => {
    setopen(false);
    e.preventDefault();
    // console.log('Get Result clicked',formData);
    setCurrentPage(1);
    const res = await fetch(api+'daily_report',{
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
 });
 if(res.ok){
    const data = await res.json();
    const newPlazaTotals = {};
    data.forEach((entry) => {
        const plaza_id = entry.plaza_code;
        const name = entry.name;
        const total_coll = parseFloat(entry.total_coll);
        const remittance = parseFloat(entry.agreed_remittance);
        const cash1 = parseFloat(entry.cash_1)
  
        if (!(plaza_id in newPlazaTotals)) {
          newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 ,cash:0.0};
        }
  
        newPlazaTotals[plaza_id].total_coll += total_coll;
        newPlazaTotals[plaza_id].remittance += remittance;
        newPlazaTotals[plaza_id].cash += cash1;
      });
      const plazaTotalsArray = Object.values(newPlazaTotals);
      plazaTotalsArray.sort((a, b) => {
        const nameA = a.name.toUpperCase(); 
        const nameB = b.name.toUpperCase(); 
    
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
    
        return 0; 
    });

      setrows(plazaTotalsArray);
      
    setshowTable(true);
 }
//  setshowTable(true);
    // console.log(TABLE_ROWS);
    
  };
  const GenerateReport = async(e) => {
    e.preventDefault();
    // console.log('Get Result clicked',formData);
    const res = await fetch(api+'daily_report',{
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
 }).then(resp => resp.json())
 .then(data =>  setgenrep(data));
    
    setexcrep(true);
    if (genrep.length !==0) {
      // console.log(genrep);
      // gen();
    } else {
      // setTimeout(() => {
      //   GenerateReport(e);
      // }, 1000); // Adjust the timeout value as needed
    }
  };

  // const sl = () =>{

  // }

  const updateplazarep = (rowData) => {
    // console.log(rowData);
    setopen(!fopn);
    setshowTable(!showTable);
    setreport(rowData);
  }
  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }
  const ddate = (value) =>{
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const date = new Date(value);
    const day = weekday[date.getDay()];
    return day;
  }
  const gen = () =>{
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headingCell = worksheet.getCell('A1');
    headingCell.value = 'M/S ASHMI ROAD CARRIERS PVT LTD';
    headingCell.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A1:J1');
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' };   

    const headingCell1 = worksheet.getCell('A2');
    headingCell1.value = 'Remittance Details and Non Fastag Cash Penalty';
    headingCell1.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A2:J2');
    headingCell1.alignment = { vertical: 'middle', horizontal: 'center' }; 

    const headingCell2 = worksheet.getCell('A3');
    headingCell2.value = 'NHAI TOLL PLAZA';
    headingCell2.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A3:J3');
    headingCell2.alignment = { vertical: 'middle', horizontal: 'center' }; 


    // const headingNames = ["Date", "WeekDay","Cash 1", "Cash 2","Monthly Pass Amount","GROSS CASH collection","FAST TAG COLLECTION","TOTAL COLLECTION","expense paid fro h.o","expense paid from toll plaza","TOTAL EXPENSES","Net Collection","Non Fastag Cash penalty","Agreed remittance","margin without expenses","profit/loss agreed remittance incl expense","%Collection up/down w.r.t Agreed remittance","TCS @2%"];
    const headingNames = ["Sr no","Toll Plaza Name","Remittance","TCS","TOTAL","NON FASTTAG CASH PENALTY","TCS ","TOTAL ","GRAND TOTAL","TOTAL COLLECTION"];
   

    // const hn = [
    //   'date_rep','wkday', 'cash_1','cash_2','monthly_pass_amount','gross_cash_rec','total_fast_tag_cl','total_coll','total_expense_from_ho','expense_from_tp','tot_exp','nc','non','agreed_remittance','margin_without_expense','p/l','per','tcs'
    // ];

    const hn = [
      'srno','name','remittance','tcs','total','non','tcs1','total1','gt','total_coll'
    ];

    for (let i = 0; i < headingNames.length; i++) {
        
        const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}4`); 
        cell.value = headingNames[i].toUpperCase();
        cell.font = { bold: true, size: 11 ,color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3f3fd5' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        

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

        const crow = worksheet.getRow(4);
        crow.height=120;
      }

    
    const hC1 = worksheet.getCell('A5');
    
    worksheet.mergeCells('A5:J5');
    hC1.alignment = { vertical: 'middle', horizontal:'center' };
    worksheet.getCell('A5').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } 
  };
  worksheet.getRow(5).height = 7;

  const newPlazaTotals = {};
  genrep.forEach((entry) => {
        const plaza_id = entry.plaza_code;
        const name = entry.name;
        const total_coll = parseFloat(entry.total_coll);
        const remittance = parseFloat(entry.agreed_remittance);
        const cash1 = parseFloat(entry.cash_1)
  
        if (!(plaza_id in newPlazaTotals)) {
          newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 ,cash:0.0};
        }
  
        newPlazaTotals[plaza_id].total_coll += total_coll;
        newPlazaTotals[plaza_id].remittance += remittance;
        newPlazaTotals[plaza_id].cash += cash1;
      });
      const plazaTotalsArray = Object.values(newPlazaTotals);
      plazaTotalsArray.sort((a, b) => {
        const nameA = a.name.toUpperCase(); 
        const nameB = b.name.toUpperCase(); 
    
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
    
        return 0; 
    });

    // console.log(plazaTotalsArray[0]);
      // report data 
      for (let i = 0; i < plazaTotalsArray.length; i++) {
        const rowData = plazaTotalsArray[i];
        // console.log(rowData);
        
        for (let j = 0; j < hn.length; j++) {
          
          const cell = worksheet.getCell(`${String.fromCharCode(65 + j)}${i + 6}`); 
          if(hn[j]==='srno'){
            cell.value = i+1;
          }else{
            if(hn[j] === 'name'){
              cell.value = rowData['name'];
            }else{
              if(hn[j]==='remittance'){
                cell.value = rowData['remittance'];
              }else{
                if(hn[j]==='tcs'){
                  cell.value = Math.ceil(parseFloat(rowData['remittance']*(tcs/100)));
                }else{
                  if(hn[j]==='total'){
                    cell.value = Math.ceil(parseFloat(rowData['remittance']*(tcs/100))+parseFloat(rowData['remittance']));
                  }else{
                    if(hn[j]==='non'){
                      cell.value = parseFloat(rowData['cash']/2);
                    }else{
                      if(hn[j]==='tcs1'){
                        cell.value = Math.ceil(parseFloat((rowData['cash']/2)*(tcs/100)))
                      }else{
                        if(hn[j]==='total1'){
                          cell.value = Math.ceil(parseFloat(parseFloat((rowData['cash']/2)*(tcs/100)))+parseFloat(rowData['cash']/2));
                        }else{
                          if(hn[j]==='gt'){
                            // cell.value = Math.ceil(parseFloat(parseFloat((rowData['cash']/2)*(tcs/100))+parseFloat(rowData['cash']/2))+parseFloat(parseFloat(rowData['remittance']*(tcs/100))+parseFloat(rowData['remittance'])));
                            cell.value = { formula: `SUM(E${i + 6}+H${i + 6})`};
                          }else{
                            cell.value = rowData['total_coll'];
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // end report data
      worksheet.getColumn('B').width = 30;
    // Create a buffer and save the workbook to it
    // TOTAL START
    const totalcell1 = worksheet.getCell(`A${plazaTotalsArray.length+6}`);
    totalcell1.value = 'TOTAL';
    totalcell1.font = { bold: true, size: 12 }; 

    
    totalcell1.alignment = { vertical: 'middle', horizontal: 'center' }; 

    const totalcell2 = worksheet.getCell(`C${plazaTotalsArray.length+6}`);
    // totalcell2.value = { formula: 'SUM(C6:C2)'};
    totalcell2.value = { formula: `SUM(C6:C${plazaTotalsArray.length+5})`};
    totalcell2.font = { bold: true, size: 12 }; 

    
    totalcell2.alignment = { vertical: 'middle', horizontal: 'right' }; 

    const totalcell3 = worksheet.getCell(`D${plazaTotalsArray.length+6}`);
    totalcell3.value = { formula: `SUM(D6:D${plazaTotalsArray.length+5})`};
    totalcell3.font = { bold: true, size: 12 }; 

    
    totalcell3.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell4 = worksheet.getCell(`E${plazaTotalsArray.length+6}`);
    totalcell4.value = { formula: `SUM(E6:E${plazaTotalsArray.length+5})`};
    totalcell4.font = { bold: true, size: 12 }; 

    
    totalcell4.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell5 = worksheet.getCell(`F${plazaTotalsArray.length+6}`);
    totalcell5.value = { formula: `SUM(F6:F${plazaTotalsArray.length+5})`};
    totalcell5.font = { bold: true, size: 12 }; 

    
    totalcell5.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell6 = worksheet.getCell(`G${plazaTotalsArray.length+6}`);
    totalcell6.value = { formula: `SUM(G6:G${plazaTotalsArray.length+5})`};
    totalcell6.font = { bold: true, size: 12 }; 

    
    totalcell6.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell7 = worksheet.getCell(`H${plazaTotalsArray.length+6}`);
    totalcell7.value = { formula: `SUM(H6:H${plazaTotalsArray.length+5})`};
    totalcell7.font = { bold: true, size: 12 }; 

    
    totalcell7.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell8 = worksheet.getCell(`I${plazaTotalsArray.length+6}`);
    totalcell8.value = { formula: `SUM(I6:I${plazaTotalsArray.length+5})`};
    totalcell8.font = { bold: true, size: 12 }; 

    
    totalcell8.alignment = { vertical: 'middle', horizontal: 'right' };

    const totalcell9 = worksheet.getCell(`J${plazaTotalsArray.length+6}`);
    totalcell9.value = { formula: `SUM(J6:J${plazaTotalsArray.length+5})`};
    totalcell9.font = { bold: true, size: 12 }; 

    
    totalcell9.alignment = { vertical: 'middle', horizontal: 'right' };

    // TOTAL END
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to a Blob and create a URL
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      // window.open(url, '_blank');
      // Create a link and trigger a click to start the download
      const a = document.createElement('a');
      a.href = url;
      // a.download = `${genrep[0].plaza_name}`+'.xlsx';
      a.download = "weekly_remittance_report.xlsx";
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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const resetform = async(e) =>{
    setFormData({
      from:currentDate,
      to:currentDate,
      plaza_code: null,
    });
    setshowTable(false);
    setopen(false);
    // setshowTable1(false);
  }

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
          <div  className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
          </div>
          <input  type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
          required
          value={formData.from}
          onChange={(e) =>{handleDateChange("from", e.target.value)}}
           />
          
          </div>
          </div>
          <div className="text-[20px] mt-[5px]"> To </div> 
            <div className=" w-[200px] px-5">        
          <div  className="relative max-w-sm">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
          </div>
          <input  type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
          required 
          onChange={(e) =>{handleDateChange("to", e.target.value)}} 
          value={formData.to}
          />
          {/* onChange={(e) =>{handleDateChange("test", e.target.value)}} */}
          </div>
          </div>
          {/* <div className='mt-[5px]'>
          <select label="Choose Plaza"
          onChange={(e) => handlePlazaChange(e.target.value)}
          value={formData.plaza_code === null ? '' : formData.plaza_code}
          className="w-[200px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Plaza</option>
            {plazas.map((plaza) => (
              <option  value={plaza.plaza_id}>
                {plaza.name}
            </option>
          ))}
          </select>
          
          </div> */}
          {/* <Button className='mx-5' color='blue'>Get Result</Button> */}
          <Button className='mx-5' color='blue' onClick={handleGetResult}>
              Get Result
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
        { showTable ? (
          <div className='w-full'>
            {/* w-[1030px] */}
      <div className="overflow-x-auto w-[100%]">
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-right">
            <thead>
              { edit ? (
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className={head === 'Sr no' ? "border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[60px]":"border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[120px]"}>
                    {/* "border-2 border-blue-gray-100 bg-blue-gray-50 p-1 w-[100px]" */}
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 uppercase"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
              ):
              <tr>
                {TABLE_HEAD1.map((head) => (
                  <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-1 w-[120px] font-bold">
                    <Typography
                      variant="small"
                      color="black"
                      className="font-bold leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
              }
            </thead>
            <tbody>
              {TABLE_ROWS.map(({ name,date_rep, cash,remittance,total_coll }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-1 border-2 w-[25px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {index+1+((currentPage-1)*10)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[50px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-left">
                      {/* {fdate(date_rep)} */}
                      {name}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-right">
                     {remittance.toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {Math.ceil(parseFloat(parseFloat(remittance)*(tcs/100))).toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(parseFloat(remittance)+parseFloat(Math.ceil(parseFloat(parseFloat(remittance)*(tcs/100))))).toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-right">
                     {Math.ceil(parseFloat(cash/2)).toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {Math.ceil(parseFloat(parseFloat(cash/2)*(tcs/100))).toFixed(2)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(parseFloat(parseFloat(cash/2).toFixed(2))+parseFloat(Math.ceil(parseFloat(parseFloat(cash/2)*(tcs/100))))).toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(parseFloat(parseFloat(parseFloat(cash/2))+parseFloat(Math.ceil(parseFloat(parseFloat(cash/2)*(tcs/100)))))+parseFloat(parseFloat(remittance)+parseFloat(Math.ceil(parseFloat(parseFloat(remittance)*(tcs/100)))))).toLocaleString("en-US")}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                     {total_coll.toLocaleString("en-US")}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
            {
              currentPage === totalPages? <>
               <tfoot>
                <tr>
                  <td  className='p-1 border-2 text-left font-bold'>
                          Total 
                  </td>
                  <td className='p-1 border-2 text-left font-bold'>

                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {(TABLE_ROWS.reduce((sum ,{ remittance }) => parseFloat(parseFloat(sum) + parseFloat(remittance)),0 )).toLocaleString("en-US")}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum, { remittance }) => (parseFloat(sum) + parseFloat(Math.ceil(parseFloat(remittance) * (tcs/100)))), 0)}
                  </td>
                  <td className='p-1 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum, { remittance }) => sum + Math.ceil(parseFloat(remittance) * (tcs/100))+ parseFloat(remittance), 0)}     
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum ,{ cash }) => parseFloat(parseFloat(sum) + parseFloat(cash/2)).toFixed(2),0 )}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum ,{ cash }) => parseFloat(parseFloat(sum) + Math.ceil(parseFloat((cash/2)*(tcs/100)))).toFixed(2),0 )}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum ,{ cash }) => parseFloat(parseFloat(sum) + Math.ceil(parseFloat((cash/2)*(tcs/100))+parseFloat(cash/2))).toFixed(2),0 )}
                  </td>
                  <td  className='p-2 border-2 text-right font-bold'>
                  {TABLE_ROWS.reduce((sum ,{ cash ,remittance}) => parseFloat(parseFloat(sum) + Math.ceil(parseFloat((cash/2)*(tcs/100))+parseFloat(cash/2))+Math.ceil(parseFloat(remittance) * (tcs/100))+ parseFloat(remittance)).toFixed(2),0 )}
                  </td>
                  <td  className='p-1 border-2 text-left font-bold'>
                  {TABLE_ROWS.reduce((sum ,{ total_coll }) => parseFloat(parseFloat(sum) + parseFloat(total_coll)).toFixed(2),0 )}
                  </td>
                </tr>
               </tfoot>
               </>:null
            }
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
              className={`mr-2 px-2 py-1 rounded ${
                currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
              }`}
              disabled={currentPage === 1}
            >
              &lt; 
            </button>
            <button
              onClick={goToNextPage}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200'
              }`}
              disabled={currentPage === totalPages}
            >
               &gt;
            </button> */}
          </div>
        </Card>
      </div>
      </div>
      ):null}
      {/* Table ends */}
      </div>
      {/* {fopn ? <div className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex flex-col items-center justify-center mt-[-20px]'>
              <div className=''>
                <div className="flex flex-row-reverse mt-[5px] mb-[-10px]">
                  <button type="button" class="rounded-md p-2 inline-flex items-center justify-center text-black hover:text-black hover: focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 h-[5px]"
                    >
                    <div className='h-[20px] w-[15px] cursor-pointer'>
                    <XMarkIcon
                    color='white'
                    className='h-[40px] cursor-pointer'
                    onClick={() => setopen(!fopn)} /> 
                    </div>
                  </button>
                </div>
                <UpdatePlazareport 
                adv_from_ho_={report.adv_from_ho}
                opening_amt_={report.opening_amt}
                total_cash_recievable_={report.total_cash_recievable}
                balaji_={report.balaji}
                monthly_pass_amt_={report.monthly_pass_amt}
                gross_cash_rec_={report.gross_cash_rec}
                total_cash_={report.total_cash}
                total_cash_rec_={report.total_cash_rec}
                short_excess_tc_={report.short_excess_tc}
                diff_cash_tp_={report.diff_cash_tp}
                total_fast_tag_cl_={report.total_fast_tag_cl}
                short_amt_adj_={report.short_amt_adj}
                excess_amt_adj_={report.excess_amt_adj}
                total_fast_tag_rec_={report.total_fast_tag_rec}
                fst_tg_trf_bnk_={report.fst_tg_trf_bnk}
                diff_reciev_={report.diff_reciev}
                cash_dep_arcpl_={report.cash_dep_arcpl}
                cash_dep_bank_={report.cash_dep_bank}
                cash_kpt_={report.cash_kpt}
                salary_={report.salary}
                plaza_code_={report.plaza_code}
                date_rep_={report.date_rep}
                entry_id_={report.id}
                user_id_={uid}
                 />
              </div>
            </div>:<div></div>} */}
            {fopn ? 
            <div className=" mt--[40px] flex items-center justify-center mb-[100px] ">
     
            <Updateplazapreport
            adv_from_ho_={report.adv_from_ho}
            opening_amt_={report.opening_amt}
            total_cash_recievable_={report.total_cash_recievable}
            balaji_={report.balaji}
            monthly_pass_amt_={report.monthly_pass_amt}
            gross_cash_rec_={report.gross_cash_rec}
            total_cash_={report.total_cash}
            total_cash_rec_={report.total_cash_rec}
            short_excess_tc_={report.short_excess_tc}
            diff_cash_tp_={report.diff_cash_tp}
            total_fast_tag_cl_={report.total_fast_tag_cl}
            short_amt_adj_={report.short_amt_adj}
            excess_amt_adj_={report.excess_amt_adj}
            total_fast_tag_rec_={report.total_fast_tag_rec}
            fst_tg_trf_bnk_={report.fst_tg_trf_bnk}
            diff_reciev_={report.diff_reciev}
            cash_dep_arcpl_={report.cash_dep_arcpl}
            cash_dep_bank_={report.cash_dep_bank}
            cash_kpt_={report.cash_kpt}
            salary_={report.salary}
            plaza_code_={report.plaza_code}
            date_rep_={report.date_rep}
            entry_id_={report.id}
            user_id_={uid}
            on_monthly_pass_amt_ = {report.on_monthly_pass_amt}
            open_ = {true}
            onCompleteTask={toggleComponentVisibility}
            />
            
           </div>:<div></div>}
      </div>
    </>
  );
}
