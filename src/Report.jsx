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

const PAGE_SIZE = 10;

// const TABLE_HEAD = ["Sr no","Date", "Opening Amount", "Advance from H.O", "Cash 1","Cash 2","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","TOTAL EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","SHORT AMOUNT ADJUSTMENT","EXCESS AMOUNT ADJUSTMENT","TOTAL FAST TAG RECEIVABLE","FAST TAG AMOUNT TRANSFER TO BANK A/C","DIFFERENCE RECEIVABLE","TOTAL COLLECTION","Operator","ACTIONS"];
const TABLE_HEAD = ["Sr no","Date", "Opening Amount", "Advance from H.O", "Cash 1","Cash 2","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","TOTAL EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","TOTAL COLLECTION","Operator","ACTIONS"];
const TABLE_HEAD1 = ["Sr no","Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM","balaji","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","CASH KEPT FOR EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","SHORT AMOUNT ADJUSTMENT","EXCESS AMOUNT ADJUSTMENT","TOTAL FAST TAG RECEIVABLE","FAST TAG AMOUNT TRANSFER TO BANK A/C","DIFFERENCE RECEIVABLE","TOTAL COLLECTION","Operator"];




export default function Report() {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [plazas, setPlazas] = useState([]);
  const [showTable,setshowTable] = useState(false);
  const [TABLE_ROWS,setrows] = useState([]);
  const [genrep,setgenrep] = useState([]);
  const [excrep,setexcrep] = useState(false);
  const [edit,setedit] = useState(false);
  const [report,setreport] = useState([]);
  const [fopn,setopen] = useState(false);
  const [uid,setuid] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    plaza_code: '',
    to: currentDate,
    from: currentDate,
  });

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const displayedRows = TABLE_ROWS.slice(startIdx, endIdx);
  // console.log(plazas);
  // const totalPages = Math.ceil(TABLE_ROWS.length / PAGE_SIZE);
  const totalPages = 1;
  
  // calculating total starts
  const gettotal = (value) =>{
    // console.log(value);
    const sums = {
       "opening_amt":0,
       "adv_from_ho":0,
       "total_cash_recievable":0,
       "balaji":0,
       "monthly_pass_amt":0,
       "gross_cash_rec":0,
       "salary":0,
       "total_cash":0,
       "total_cash_rec":0,
       "short_excess_tc":0,
       "cash_dep_bank":0,
       "cash_dep_arcpl":0,
       "cash_kpt":0,
       "diff_cash_tp":0,
       "total_fast_tag_cl":0,
       "short_amt_adj":0,
       "excess_amt_adj":0,
       "on_monthly_pass_amt":0,
       "total_fast_tag_rec":0,
       "fst_tg_trf_bnk":0,
       "diff_reciev":0,
       "total_coll":0,
       "initial_opn":0,
       "exp_not":0
  };
  value.forEach(obj => {
    for (const key in sums) {
        sums[key] += parseFloat(obj[key]) || 0;
    }
});

const total_sum = {
  "opening_amt":sums['opening_amt']+sums['initial_opn'],
  "adv_from_ho":sums['adv_from_ho'],
  "total_cash_recievable":sums['total_cash_recievable'],
  "balaji":sums['balaji'],
  "monthly_pass_amt":sums['monthly_pass_amt'],
  "gross_cash_rec":sums['gross_cash_rec'],
  "salary":sums['salary'],
  "total_cash":sums['total_cash'],
  "total_cash_rec":sums['total_cash_rec'],
  "short_excess_tc":sums['short_excess_tc'],
  "cash_dep_bank":sums['cash_dep_bank'],
  "cash_dep_arcpl":sums['cash_dep_arcpl'],
  "cash_kpt":sums['cash_kpt'],
  "diff_cash_tp":sums['diff_cash_tp']+sums['initial_opn'],
  "total_fast_tag_cl":sums['total_fast_tag_cl'],
  "short_amt_adj":sums['short_amt_adj'],
  "excess_amt_adj":sums['excess_amt_adj'],
  "on_monthly_pass_amt":sums['on_monthly_pass_amt'],
  "total_fast_tag_rec":sums['total_fast_tag_rec'],
  "fst_tg_trf_bnk":sums['fst_tg_trf_bnk'],
  "diff_reciev":sums['diff_reciev'],
  "total_coll":sums['total_coll'],
  "initial_opn":sums['initial_opn'],
  "exp_not":sums['exp_not']
};

   
    return total_sum;
  }

  const total_consolidate = gettotal(TABLE_ROWS);
  // calculating total ends

  const changePage = (page) => {
    setCurrentPage(page);
  };


  const toggleComponentVisibility = () => {
    setopen(!fopn);
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
      if(data.user.rid=='2'){
        setedit(false);
      }else{
      window.location.href = '/';
      }
    }
    if(excrep){
      gen();
      setexcrep(!excrep);
    }
    fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        setPlazas(data);
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
    const res = await fetch(api+'generate_report',{
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
 }).then(resp => resp.json())
 .then(data => 
  setrows(data.data)
  // console.log(data.data)
 );
 setshowTable(true);
    // console.log(TABLE_ROWS);
    
  };
  const GenerateReport = async(e) => {
    e.preventDefault();
    // console.log('Get Result clicked',formData);
    const res = await fetch(api+'generate_report',{
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
 }).then(resp => resp.json())
 .then(data =>  setgenrep(data.data));
    // console.log(TABLE_ROWS);
    // ,() => {
    //   gen();
    //  }
    // setTimeout(() => {
      // const sip = await gen;
      // gen();
    // }, 10000);
    // setTimeout(gen, 10000);
    // gen();
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
  const gen = () =>{
    // setTimeout(gen, 8000);
    // console.log(genrep);
    // if(genrep.length !== 0){
      // console.log("inside");
      // console.log(genrep);
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headingCell = worksheet.getCell('A1');
    headingCell.value = 'M/S ASHMI ROAD CARRIERS PVT LTD';
    headingCell.font = { bold: true, size: 12 }; 

    // worksheet.addRows(jsonData);
    worksheet.mergeCells('A1:W1');
    headingCell.alignment = { vertical: 'middle', horizontal: 'center' };   

    const hC1 = worksheet.getCell('A2');
    hC1.value=genrep[0].plaza_name;
    hC1.font = {bold:true,size:12};
    worksheet.mergeCells('A2:W2');
    hC1.alignment = { vertical: 'middle', horizontal:'center' };


    const hC2 = worksheet.getCell('A3');
    hC2.value='CASH REPORT';
    hC2.font = {bold:true,size:12};
    worksheet.mergeCells('A3:P3');
    hC2.alignment = { vertical: 'middle', horizontal:'center' };


    const hC3 = worksheet.getCell('R3');
    hC3.value='FAST TAG REPORT';
    hC3.font = {bold:true,size:12};
    worksheet.mergeCells('R3:V3');
    hC3.alignment = { vertical: 'middle', horizontal:'center' };

    // Details 
    // const hC4 = worksheet.getCell('A4');
    // hC4.value='DATE';
    // hC4.font = {bold:true,size:12};
    // hC4.alignment = { vertical: 'middle', horizontal:'center',wrapText:true };
    

    // const hC5 = worksheet.getCell('B4');
    // hC5.value='OPENING AMOUNT';
    // hC5.font = {bold:true,size:12};
    // hC5.alignment = { vertical: 'middle', horizontal:'center',wrapText:true };

    const headingNames = [
        'DATE', 'OPENING AMOUNT', 'ADVANCE FROM HO', 'TOTAL CASH RECEIVABLE AS PER SYSTEM (TOLL + POS + PAYTM / GOOGLE PAY / PHONE PAY)', 'BALAJI', 'MONTHLY PASS AMOUNT','ONLINE MONTHLY PASS AMOUNT', 'GROSS CASH RECEIVABLE FROM TOLL PLAZA',
        'TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS', 'TOTAL RECEPTS FROM TC', 'SHORT/EXCESS COLLECTION FROM TC', 'CASH DEPOSITED DIRECTLY TO BANK', 'CASH DEPOSITED IN ARCPL OFFICE', 'CASH KEPT FOR EXPENSES','SALARY', 'DIFFERENCE CASH IN TOLLPLAZA','',
        'TOTAL FAST TAG COLLECTION', 'SHORT AMOUNT ADJUSTMENT', 'EXCESS AMOUNT ADJUSTMENT', 'TOTAL FAST TAG RECEIVABLE', 'FAST TAG AMOUNT TRANSFER TO BANK A/C', 'DIFFERENCE RECEIVABLE','', 'TOTAL COLLECTION'
      ];

    const hn = [
      'date_rep', 'opening_amt', 'adv_from_ho','total_cash_recievable','balaji','monthly_pass_amt','on_monthly_pass_amt','gross_cash_rec','total_cash','total_cash_rec','short_excess_tc','cash_dep_bank','cash_dep_arcpl','cash_kpt','salary','diff_cash_tp','','total_fast_tag_cl','short_amt_adj','excess_amt_adj','total_fast_tag_rec','fst_tg_trf_bnk','diff_reciev','','total_coll'
    ];
   
    for (let i = 0; i < headingNames.length; i++) {
        if(i ===16 || i === 23){
            continue;
        }
        const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}4`); // A=65, B=66, ..., W=87
        cell.value = headingNames[i];
        cell.font = { bold: true, size: 11 };
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
        crow.height=180;
      }

    // Details Ended
    for (let row = 3; row <= 34; row++) {
        const cell = worksheet.getCell(`Q${row}`);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' } // Yellow background color, you can change it as needed
        };
      }

      for (let row = 4;row<=34;row++){
        const cell = worksheet.getCell(`H${row}`);
        cell.fill = {
          type:'pattern',
          pattern:'solid',
          fgColor:{argb:'FCD5B4'}
        }
      }

      for (let row = 4;row<=34;row++){
        const cell = worksheet.getCell(`J${row}`);
        cell.fill = {
          type:'pattern',
          pattern:'solid',
          fgColor:{argb:'FCD5B4'}
        }
      }

      for (let row = 4;row<=34;row++){
        const cell = worksheet.getCell(`S${row}`);
        cell.fill = {
          type:'pattern',
          pattern:'solid',
          fgColor:{argb:'D8E4BC'}
        }
      }

      worksheet.getColumn('Q').width = 1;

      // worksheet.getCell('A4').width=1;


      for (let row = 3; row <= 34; row++) {
        const cell = worksheet.getCell(`X${row}`);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' } // Yellow background color, you can change it as needed
        };
      }

      worksheet.getColumn('X').width = 1;

      // report data 
      for (let i = 0; i < genrep.length; i++) {
        const rowData = genrep[i];
        // console.log(rowData);
        // let row = worksheet.getRow(i + 5);
      // console.log(rowData);
        for (let j = 0; j < hn.length; j++) {
          if(j ===16 || j === 23){
            continue;
        }
          const cell = worksheet.getCell(`${String.fromCharCode(65 + j)}${i + 5}`); 
          // cell.value = rowData[hn[j]];
          if (hn[j] === 'date_rep' ) {
            // && rowData[hn[j]]
            const date = new Date(rowData[hn[j]]);
            const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
            cell.value = formattedDate;
        } else {
          if(hn[j] === 'opening_amt'){
            cell.value = (parseFloat(rowData['opening_amt'])+parseFloat(rowData['initial_opn']))
          }else{
          if(hn[j] === 'diff_cash_tp'){
            cell.value = (parseFloat(rowData['diff_cash_tp'])+parseFloat(rowData['initial_opn']))
          }else{
            if(hn[j]==='total_coll'){
              cell.value = (parseFloat(rowData['total_coll'])+parseFloat(rowData['on_monthly_pass_amt']))
            }else{
            cell.value = parseFloat(rowData[hn[j]]);
            }
          }
        }
            
        }
        }
      }
      // end report data
      // worksheet.getColumn('A').width = 20;
    // Create a buffer and save the workbook to it
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to a Blob and create a URL
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      // window.open(url, '_blank');
      // Create a link and trigger a click to start the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${genrep[0].plaza_name}`+'.xlsx';
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
    <div className='my-5'>
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
          <div className='mt-[5px]'>
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
          
          </div>
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
      <div className=" w-[100%] h-full ">
        {/* <Card className="h-full w-full overflow-scroll"> */}
          <table className="w-full min-w-max  text-right bg-white">
            <thead>
              { edit ? (
              <tr className='sticky top-0 z-[9]'>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className={head === 'Sr no' ? "border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[60px]":head === 'Date'?"border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[120px] left-0 sticky z-10":"border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[120px]"}>
                    {/* "border-2 border-blue-gray-100 bg-blue-gray-50 p-1 w-[100px]" */}
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70 uppercase "
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
              {TABLE_ROWS.map(({ date_rep, opening_amt,id, adv_from_ho,total_cash_recievable,balaji,monthly_pass_amt,gross_cash_rec,salary,total_cash,total_cash_rec,short_excess_tc,cash_dep_bank,cash_dep_arcpl,cash_kpt,diff_cash_tp,total_fast_tag_cl,short_amt_adj,excess_amt_adj,on_monthly_pass_amt,total_fast_tag_rec,fst_tg_trf_bnk,diff_reciev,total_coll,operator,plaza_code,initial_opn,exp_not }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-1 border-2 w-[25px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {index+1+((currentPage-1)*10)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[50px] sticky left-0 z-[8] bg-white">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {fdate(date_rep)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(opening_amt)+parseFloat(initial_opn)}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="hidden">
                      {id}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="hidden">
                      {plaza_code}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {adv_from_ho}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash_recievable}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {balaji}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {monthly_pass_amt}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {on_monthly_pass_amt}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(gross_cash_rec)+parseFloat(on_monthly_pass_amt)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash_rec}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {short_excess_tc}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_dep_bank}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_dep_arcpl}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(cash_kpt-exp_not)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {salary}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(diff_cash_tp)+parseFloat(initial_opn)}
                    </Typography> 
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_fast_tag_cl}
                    </Typography>
                  </td>
                  {/* <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {short_amt_adj}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {excess_amt_adj}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_fast_tag_rec}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {fst_tg_trf_bnk}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {diff_reciev}
                    </Typography>
                  </td> */}
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(total_coll)+parseFloat(on_monthly_pass_amt)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {operator}
                    </Typography>
                  </td>
                  {/* <td className="p-4 border-2">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {operator}
                    </Typography>
                  </td> */}
                  {edit ?(
                  <td className="p-1 border-2 w-[30px]">
                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium text-center">
                      <button className='  h-5 w-5'><PencilSquareIcon color='green'
                      onClick={() => updateplazarep({date_rep, id,opening_amt, adv_from_ho,total_cash_recievable,balaji,monthly_pass_amt,gross_cash_rec,salary,total_cash,total_cash_rec,short_excess_tc,cash_dep_bank,cash_dep_arcpl,cash_kpt,diff_cash_tp,total_fast_tag_cl,short_amt_adj,excess_amt_adj,total_fast_tag_rec,fst_tg_trf_bnk,diff_reciev,total_coll,operator,plaza_code,on_monthly_pass_amt})}/></button>
                    </Typography>
                  </td>
                  ):null}
                </tr>
              ))}
            </tbody>
            <tfoot>
                <tr>
                  <td  className='p-1 border-2 text-left font-bold'>
                          Total 
                  </td>
                  <td  className='p-1 border-2 text-left font-bold'>
                          
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {/* {total_consolidate['opening_amt']}  */}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {parseFloat(total_consolidate['adv_from_ho']).toFixed(2)} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_cash_recievable']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['balaji']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['monthly_pass_amt']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['on_monthly_pass_amt']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['gross_cash_rec']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_cash']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_cash_rec']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['short_excess_tc']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['cash_dep_bank']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['cash_dep_arcpl']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {parseFloat(total_consolidate['cash_kpt']-total_consolidate['exp_not'])}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['salary']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {/* {total_consolidate['diff_cash_tp']} */}
                  </td>
                  <td  className={`p-1 border-2 text-right font-bold`}>
                  {total_consolidate['total_fast_tag_cl']} 
                  </td>
                  {/* <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['short_amt_adj']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['excess_amt_adj']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_fast_tag_rec']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['fst_tg_trf_bnk']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['diff_reciev']} 
                  </td> */}
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_coll']} 
                  </td>
                </tr>
               </tfoot>
          </table>
      </div>
      </div>
      ):null}
      {/* Table ends */}
      </div>
      
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


{/* <div className='flex justify-center m-2'>
          <Typography variant="small" color="blue-gray" className="mr-2">
              Page {currentPage} of {totalPages}
            </Typography>
            </div>
          <div className="flex justify-center p-4">
            <button
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
            </button>
          </div> */}
        {/* </Card> */}