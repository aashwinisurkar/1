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
// const TABLE_HEAD = ["Sr no","Toll Plaza Name","Remittance","TCS","TOTAL","NON FASTTAG CASH PENALTY","TCS ","TOTAL ","GRAND TOTAL","TOTAL COLLECTION"];
const TABLE_HEAD = ["Sr no","Toll Plaza Name","Cash 1", "Cash 2","Monthly Pass Amount","GROSS CASH collection","FAST TAG COLLECTION","TOTAL COLLECTION","expense paid fro h.o","expense paid from toll plaza","TOTAL EXPENSES","Net Collection","Non Fastag Cash penalty","Agreed remittance","margin without expenses","profit/loss agreed remittance incl expense","%Collection up/down w.r.t Agreed remittance","TCS"];
// ,"ACTIONS"
const TABLE_HEAD1 = ["Sr no","Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM","balaji","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","CASH KEPT FOR EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","SHORT AMOUNT ADJUSTMENT","EXCESS AMOUNT ADJUSTMENT","TOTAL FAST TAG RECEIVABLE","FAST TAG AMOUNT TRANSFER TO BANK A/C","DIFFERENCE RECEIVABLE","TOTAL COLLECTION","Operator"];




export default function Fin_month_report() {
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [plazas, setPlazas] = useState([
    {name:'January',id:1},
    {name:'February',id:2},
    {name:'March',id:3},
    {name:'April',id:4},
    {name:'May',id:5},
    {name:'June',id:6},
    {name:'July',id:7},
    {name:'August',id:8},
    {name:'September',id:9},
    {name:'October',id:10},
    {name:'November',id:11},
    {name:'December',id:12}
]);
  const [showTable,setshowTable] = useState(false);
  const [TABLE_ROWS,setrows] = useState([]);
  const [totalcon,setcon] = useState([]);
  const [genrep,setgenrep] = useState([]);
  const [excrep,setexcrep] = useState(false);
  const [edit,setedit] = useState(false);
  const [report,setreport] = useState([]);
  const [fopn,setopen] = useState(false);
  const [uid,setuid] = useState('');
  const [years,setyears] = useState([]);
  const [tcs,settcs] = useState(null);
  const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    month: '',
    year: '',
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
    const currentYear = new Date().getFullYear();
    const year = [];
    for(let i = 0;i<10;i++){
        // year.push(currentYear - i);
        year.push({ name: currentYear - i, id: currentYear - i });
    }

    setyears(year);
    // console.log(year);

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

  const handleMonthChange = (value) => {
    // console.log(value);
    setshowTable(false);
    setFormData({
      ...formData,
      month: value,
    });
  };

  const handleYearChange = (value) => {
    // console.log(value);
    setshowTable(false);
    setFormData({
      ...formData,
      year: value,
    });
  };

  const handleGetResult = async(e) => {
    setopen(false);
    e.preventDefault();
    // console.log('Get Result clicked',formData);
    setCurrentPage(1);
    const res = await fetch(api+'monthly_report_cons',{
      method: "POST",
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
        const cash1 = parseFloat(entry.cash_1);
        const cash2 = parseFloat(entry.cash_2);
        const mpa = parseFloat(entry.monthly_pass_amount);
        const gcr = parseFloat(entry.gross_cash_rec);
        const tfst = parseFloat(entry.total_fast_tag_cl);
        const hoexp = parseFloat(entry.total_expense_from_ho);
        const tpexp = parseFloat(entry.expense_from_tp);
        const ar = parseFloat(entry.agreed_remittance);
  
        if (!(plaza_id in newPlazaTotals)) {
          newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 ,cash_1:0.0,cash_2:0.0,monthly_pass_amount:0.0,gross_cash_rec:0.0,total_fast_tag_cl:0.0,total_expense_from_ho:0.0,expense_from_tp:0.0,agreed_remittance:0.0};
        }
  
        newPlazaTotals[plaza_id].total_coll += total_coll;
        newPlazaTotals[plaza_id].remittance += remittance;
        newPlazaTotals[plaza_id].cash_1 += cash1;
        newPlazaTotals[plaza_id].cash_2 += cash2;
        newPlazaTotals[plaza_id].monthly_pass_amount += mpa;
        newPlazaTotals[plaza_id].gross_cash_rec += gcr;
        newPlazaTotals[plaza_id].total_fast_tag_cl+=tfst;
        newPlazaTotals[plaza_id].total_expense_from_ho+=hoexp;
        newPlazaTotals[plaza_id].expense_from_tp+=tpexp;
        newPlazaTotals[plaza_id].agreed_remittance +=ar;
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
  const convertToMonthYear = (input) => {
    const { month, year } = input;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(month) - 1];
    return `${monthName} - ${year}`;
  }

  const GenerateReport = async(e) => {
    e.preventDefault();
    // console.log('Get Result clicked',formData);
    const res = await fetch(api+'monthly_report_cons',{
      method: "POST",
      //mode: 'no-cors',
      body: JSON.stringify(formData)
 });
//  .then(resp => resp.json())
//  .then(data =>  setgenrep(data));
if(res.ok){
  const data = await res.json();
    const newPlazaTotals = {};
    data.forEach((entry) => {
        const plaza_id = entry.plaza_code;
        const name = entry.name;
        const total_coll = parseFloat(entry.total_coll);
        const remittance = parseFloat(entry.agreed_remittance);
        const cash1 = parseFloat(entry.cash_1);
        const cash2 = parseFloat(entry.cash_2);
        const mpa = parseFloat(entry.monthly_pass_amount);
        const gcr = parseFloat(entry.gross_cash_rec);
        const tfst = parseFloat(entry.total_fast_tag_cl);
        const hoexp = parseFloat(entry.total_expense_from_ho);
        const tpexp = parseFloat(entry.expense_from_tp);
        const ar = parseFloat(entry.agreed_remittance);
  
        if (!(plaza_id in newPlazaTotals)) {
          newPlazaTotals[plaza_id] = { name, total_coll: 0.0, remittance: 0.0 ,cash_1:0.0,cash_2:0.0,monthly_pass_amount:0.0,gross_cash_rec:0.0,total_fast_tag_cl:0.0,total_expense_from_ho:0.0,expense_from_tp:0.0,agreed_remittance:0.0,month:convertToMonthYear(formData)};
        }
  
        newPlazaTotals[plaza_id].total_coll += total_coll;
        newPlazaTotals[plaza_id].remittance += remittance;
        newPlazaTotals[plaza_id].cash_1 += cash1;
        newPlazaTotals[plaza_id].cash_2 += cash2;
        newPlazaTotals[plaza_id].monthly_pass_amount += mpa;
        newPlazaTotals[plaza_id].gross_cash_rec += gcr;
        newPlazaTotals[plaza_id].total_fast_tag_cl+=tfst;
        newPlazaTotals[plaza_id].total_expense_from_ho+=hoexp;
        newPlazaTotals[plaza_id].expense_from_tp+=tpexp;
        newPlazaTotals[plaza_id].agreed_remittance +=ar;
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
    setgenrep(plazaTotalsArray);
  // console.log(data);
    setexcrep(true);
    if (genrep.length !==0) {
      // console.log(genrep);
      // gen();
    } else {
      // setTimeout(() => {
      //   GenerateReport(e);
      // }, 1000); // Adjust the timeout value as needed
    }
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

    // const hC1 = worksheet.getCell('A2');
    // hC1.value=genrep[0].plaza_name;
    // hC1.font = {bold:true,size:12};
    // worksheet.mergeCells('A2:W2');
    // hC1.alignment = { vertical: 'middle', horizontal:'center' };


    // const hC2 = worksheet.getCell('A3');
    // hC2.value='CASH REPORT';
    // hC2.font = {bold:true,size:12};
    // worksheet.mergeCells('A3:N3');
    // hC2.alignment = { vertical: 'middle', horizontal:'center' };


    // const hC3 = worksheet.getCell('Q3');
    // hC3.value='FAST TAG REPORT';
    // hC3.font = {bold:true,size:12};
    // worksheet.mergeCells('Q3:U3');
    // hC3.alignment = { vertical: 'middle', horizontal:'center' };

    // Details 
    // const hC4 = worksheet.getCell('A4');
    // hC4.value='DATE';
    // hC4.font = {bold:true,size:12};
    // hC4.alignment = { vertical: 'middle', horizontal:'center',wrapText:true };
    

    // const hC5 = worksheet.getCell('B4');
    // hC5.value='OPENING AMOUNT';
    // hC5.font = {bold:true,size:12};
    // hC5.alignment = { vertical: 'middle', horizontal:'center',wrapText:true };

    // const headingNames = [
    //     'DATE', 'OPENING AMOUNT', 'ADVANCE FROM HO', 'TOTAL CASH RECEIVABLE AS PER SYSTEM (TOLL + POS + PAYTM / GOOGLE PAY / PHONE PAY)', 'BALAJI', 'MONTHLY PASS AMOUNT', 'GROSS CASH RECEIVABLE FROM TOLL PLAZA',
    //     'TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS', 'TOTAL RECEPTS FROM TC', 'SHORT/EXCESS COLLECTION FROM TC', 'CASH DEPOSITED DIRECTLY TO BANK', 'CASH DEPOSITED IN ARCPL OFFICE', 'CASH KEPT FOR EXPENSES','SALARY', 'DIFFERENCE CASH IN TOLLPLAZA','',
    //     'TOTAL FAST TAG COLLECTION', 'SHORT AMOUNT ADJUSTMENT', 'EXCESS AMOUNT ADJUSTMENT', 'TOTAL FAST TAG RECEIVABLE', 'FAST TAG AMOUNT TRANSFER TO BANK A/C', 'DIFFERENCE RECEIVABLE','', 'TOTAL COLLECTION'
    //   ];

    const headingNames = ["Sr no","Month","Toll Plaza Name","Cash 1", "Cash 2","Monthly Pass Amount","GROSS CASH collection","FAST TAG COLLECTION","TOTAL COLLECTION","expense paid fro h.o","expense paid from toll plaza","TOTAL EXPENSES","Net Collection","Non Fastag Cash penalty","Agreed remittance","margin without expenses","profit/loss agreed remittance incl expense","%Collection up/down w.r.t Agreed remittance","TCS"];
    // const hn = [
    //   'date_rep', 'opening_amt', 'adv_from_ho','total_cash_recievable','balaji','monthly_pass_amt','gross_cash_rec','total_cash','total_cash_rec','short_excess_tc','cash_dep_bank','cash_dep_arcpl','cash_kpt','salary','diff_cash_tp','','total_fast_tag_cl','short_amt_adj','excess_amt_adj','total_fast_tag_rec','fst_tg_trf_bnk','diff_reciev','','total_coll'
    // ];
   

    const hn = [
      'date_rep','month','wkday', 'cash_1','cash_2','monthly_pass_amount','gross_cash_rec','total_fast_tag_cl','total_coll','total_expense_from_ho','expense_from_tp','tot_exp','nc','non','agreed_remittance','margin_without_expense','p/l','per','tcs'
    ];

    for (let i = 0; i < headingNames.length; i++) {
        
        const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}2`); 
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

        const crow = worksheet.getRow(2);
        crow.height=120;
      }

      const columnsecond = worksheet.getColumn(`${String.fromCharCode(65 + 2)}`)
      columnsecond.width = 25;
    //   worksheet.views = [
    //     { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'B2' }
    // ];
    // Details Ended
    // for (let row = 3; row <= 34; row++) {
    //     const cell = worksheet.getCell(`P${row}`);
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: 'FFFF00' } 
    //     };
    //   }
    const hC1 = worksheet.getCell('A3');
    
    worksheet.mergeCells('A3:S3');
    hC1.alignment = { vertical: 'middle', horizontal:'center' };
    worksheet.getCell('A3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } 
  };
  worksheet.getRow(3).height = 7;
      // for (let row = 4;row<=34;row++){
      //   const cell = worksheet.getCell(`G${row}`);
      //   cell.fill = {
      //     type:'pattern',
      //     pattern:'solid',
      //     fgColor:{argb:'FCD5B4'}
      //   }
      // }

      // for (let row = 4;row<=34;row++){
      //   const cell = worksheet.getCell(`I${row}`);
      //   cell.fill = {
      //     type:'pattern',
      //     pattern:'solid',
      //     fgColor:{argb:'FCD5B4'}
      //   }
      // }

      // for (let row = 4;row<=34;row++){
      //   const cell = worksheet.getCell(`S${row}`);
      //   cell.fill = {
      //     type:'pattern',
      //     pattern:'solid',
      //     fgColor:{argb:'D8E4BC'}
      //   }
      // }

      // worksheet.getColumn('P').width = 1;

      // worksheet.getCell('A4').width=1;


      // for (let row = 3; row <= 34; row++) {
      //   const cell = worksheet.getCell(`W${row}`);
      //   cell.fill = {
      //     type: 'pattern',
      //     pattern: 'solid',
      //     fgColor: { argb: 'FFFF00' } 
      //   };
      // }

      // worksheet.getColumn('W').width = 1;

      // report data 
      for (let i = 0; i < genrep.length; i++) {
        const rowData = genrep[i];
        // console.log(rowData);
        
        for (let j = 0; j < hn.length; j++) {
          
          const cell = worksheet.getCell(`${String.fromCharCode(65 + j)}${i + 4}`); 
          if (hn[j] === 'date_rep' ) {
            // const date = new Date(rowData[hn[j]]);
            // const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
            // cell.value = formattedDate;
            cell.value = i+1;
        } else {
       
        if(hn[j] === 'wkday'){
          // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
          // const date = new Date(rowData['date_rep']);
          // const day = weekday[date.getDay()];
          // cell.value= day;
          // console.log(rowData[hn['date_rep']]);
          cell.value = rowData['name'];
          
        }else{
          if(hn[j]==='total_coll'){
            cell.value= parseFloat(rowData['total_coll']);
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }else{
            if(hn[j]==='total_expense_from_ho'){
              cell.value = parseFloat(rowData['total_expense_from_ho']);
              // console.log(rowData['total_expense_from_ho']);
              cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
            }else{
              if(hn[j]==='tot_exp'){
                cell.value= parseFloat(rowData['total_expense_from_ho']+rowData['expense_from_tp']);
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
              }else{
                if(hn[j]==='nc'){
                  cell.value = parseFloat(rowData['total_coll']-rowData['total_expense_from_ho']-rowData['expense_from_tp']);
                  cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                }else{
                  if(hn[j]==='non'){
                    cell.value = parseFloat(rowData['cash_1']/2);
                    cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                  }else{
                    if(hn[j]==='margin_without_expense'){
                      cell.value = parseFloat(rowData['total_coll']-rowData['agreed_remittance']);
                      cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                    }else{
                      if(hn[j]==='p/l'){
                        cell.value= parseFloat(rowData['total_coll']-rowData['agreed_remittance']-rowData['total_expense_from_ho']-rowData['expense_from_tp']-parseFloat(rowData['cash_1']/2));
                        cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                      }else{
                        if(hn[j]==='per'){
                          cell.value = parseFloat(parseFloat(parseFloat(parseFloat(rowData['total_coll']-rowData['agreed_remittance'])/rowData['agreed_remittance'])*100).toFixed(2));
                          cell.font = { color: rowData['total_coll']-rowData['agreed_remittance'] >= 0 ? { argb: '008000' } : { argb: 'FFFF0000' } };
                          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                        }else{
                          if(hn[j]==='tcs'){
                            cell.value = parseFloat(parseFloat(parseFloat(parseFloat(rowData['cash_1']/2)+parseFloat(rowData['agreed_remittance']))*(tcs/100)).toFixed(2));
                            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                          }else{
                            if(hn[j]==='month'){
                              cell.value = rowData[hn[j]];
                            }else{
                            cell.value = parseFloat(rowData[hn[j]]);
                            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
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
        }
        }
      }
      // end report data
      // total start
      const totalcell1 = worksheet.getCell(`A${genrep.length+4}`);
      totalcell1.value = 'TOTAL';
      totalcell1.font = { bold: true, size: 12 }; 
      totalcell1.alignment = { vertical: 'middle', horizontal: 'center' }; 

      const totalcell2 = worksheet.getCell(`D${genrep.length+4}`);
      totalcell2.value = { formula: `SUM(D4:D${genrep.length+3})`};
      totalcell2.font = { bold: true, size: 12 };
      totalcell2.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell3 = worksheet.getCell(`E${genrep.length+4}`);
      totalcell3.value = { formula: `SUM(E4:E${genrep.length+3})`};
      totalcell3.font = { bold: true, size: 12 };
      totalcell3.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell4 = worksheet.getCell(`F${genrep.length+4}`);
      totalcell4.value = { formula: `SUM(F4:F${genrep.length+3})`};
      totalcell4.font = { bold: true, size: 12 };
      totalcell4.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell5 = worksheet.getCell(`G${genrep.length+4}`);
      totalcell5.value = { formula: `SUM(G4:G${genrep.length+3})`};
      totalcell5.font = { bold: true, size: 12 };
      totalcell5.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell6 = worksheet.getCell(`H${genrep.length+4}`);
      totalcell6.value = { formula: `SUM(H4:H${genrep.length+3})`};
      totalcell6.font = { bold: true, size: 12 };
      totalcell6.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell7 = worksheet.getCell(`I${genrep.length+4}`);
      totalcell7.value = { formula: `SUM(I4:I${genrep.length+3})`};
      totalcell7.font = { bold: true, size: 12 };
      totalcell7.alignment = { vertical: 'middle', horizontal: 'right' };


      const totalcell8 = worksheet.getCell(`J${genrep.length+4}`);
      totalcell8.value = { formula: `SUM(J4:J${genrep.length+3})`};
      totalcell8.font = { bold: true, size: 12 };
      totalcell8.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell9 = worksheet.getCell(`K${genrep.length+4}`);
      totalcell9.value = { formula: `SUM(K4:K${genrep.length+3})`};
      totalcell9.font = { bold: true, size: 12 };
      totalcell9.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell10 = worksheet.getCell(`L${genrep.length+4}`);
      totalcell10.value = { formula: `SUM(L4:L${genrep.length+3})`};
      totalcell10.font = { bold: true, size: 12 };
      totalcell10.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell11 = worksheet.getCell(`M${genrep.length+4}`);
      totalcell11.value = { formula: `SUM(M4:M${genrep.length+3})`};
      totalcell11.font = { bold: true, size: 12 };
      totalcell11.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell12 = worksheet.getCell(`N${genrep.length+4}`);
      totalcell12.value = { formula: `SUM(N4:N${genrep.length+3})`};
      totalcell12.font = { bold: true, size: 12 };
      totalcell12.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell13 = worksheet.getCell(`O${genrep.length+4}`);
      totalcell13.value = { formula: `SUM(O4:O${genrep.length+3})`};
      totalcell13.font = { bold: true, size: 12 };
      totalcell13.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell14 = worksheet.getCell(`P${genrep.length+4}`);
      totalcell14.value = { formula: `SUM(P4:P${genrep.length+3})`};
      totalcell14.font = { bold: true, size: 12 };
      totalcell14.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell15 = worksheet.getCell(`Q${genrep.length+4}`);
      totalcell15.value = { formula: `SUM(Q4:Q${genrep.length+3})`};
      totalcell15.font = { bold: true, size: 12 };
      totalcell15.alignment = { vertical: 'middle', horizontal: 'right' };

      const totalcell16 = worksheet.getCell(`S${genrep.length+4}`);
      totalcell16.value = { formula: `SUM(S4:S${genrep.length+3})`};
      totalcell16.font = { bold: true, size: 12 };
      totalcell16.alignment = { vertical: 'middle', horizontal: 'right' };

      // #,##0.00

      const totalcell17 = worksheet.getCell(`R${genrep.length+4}`);
      totalcell17.value = { formula: `AVERAGE(R4:R${genrep.length+3})`};
      totalcell17.font = { bold: true, size: 12 };
      totalcell17.alignment = { vertical: 'middle', horizontal: 'right' };
      totalcell17.numFmt = '#,##0.00';

      // total end
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
      // a.download = `${genrep[0].plaza_name}`+'.xlsx';
      a.download = "monthwise_plaza_report.xlsx";
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
      month:'',
      year:'',
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
        <div className="text-[20px] mt-[5px]">Choose Month</div> 
            
          
          <div className='mt-[5px]  ml-[5px]'>
          <select label="Choose Plaza"
          onChange={(e) => handleMonthChange(e.target.value)}
          value={formData.month === null ? '' : formData.month}
          className="w-[120px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Month</option>
            {plazas.map((month) => (
              <option  value={month.id}>
                {month.name}
            </option>
          ))}
          </select>
          
          </div>

          <div className="text-[20px] mt-[5px] ml-[5px]">Choose Year</div> 
            
          
          <div className='mt-[5px]  ml-[5px]'>
          <select label="Choose Year"
          onChange={(e) => handleYearChange(e.target.value)}
          value={formData.year === null ? '' : formData.year}
          className="w-[120px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select year</option>
            {years.map((year) => (
              <option  value={year.id}>
                {year.name}
            </option>
          ))}
          </select>
          
          </div>
          {/* <Button className='mx-5' color='blue'>Get Result</Button> */}
          <Button className='mx-5 bg-blue-500 '  onClick={handleGetResult}>
              Get Result
          </Button>
          <Button  color='green'  onClick={GenerateReport}>Generate Report</Button>
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
              {TABLE_ROWS.map(({ date_rep,name, cash_1,cash_2,monthly_pass_amount,gross_cash_rec,total_fast_tag_cl,expense_from_tp,total_coll,agreed_remittance,total_expense_from_ho,margin_without_expense }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-1 border-2 w-[25px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {index+1+((currentPage-1)*10)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[50px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {name}
                    </Typography>
                  </td>
                  {/* <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-center">
                      {ddate(date_rep)}
                    </Typography>
                    
                  </td> */}
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_1}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_2}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {monthly_pass_amount}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {gross_cash_rec}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_fast_tag_cl}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_coll}
                    </Typography>
                  </td>
                  {/* <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_coll}
                    </Typography>
                  </td> */}
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_expense_from_ho}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {expense_from_tp}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(expense_from_tp)+parseFloat(total_expense_from_ho)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(total_coll)-parseFloat(expense_from_tp)-parseFloat(total_expense_from_ho)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                     {parseFloat(cash_1/2).toFixed(2)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {agreed_remittance}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(total_coll)-parseFloat(agreed_remittance)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                    {parseFloat(parseFloat(total_coll)-parseFloat(agreed_remittance)-parseFloat(expense_from_tp)-parseFloat(total_expense_from_ho)-parseFloat(cash_1/2)).toFixed(2)}
                    </Typography> 
                  </td>
                  {/* <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(((parseFloat(total_coll)-parseFloat(agreed_remittance))/parseFloat(agreed_remittance))*100).toFixed(2)}
                    </Typography>
                  </td> */}
                  <td className="p-1 border-2 w-[30px]">
  <Typography
    variant="small"
    className="font-normal"
    style={{ color: (parseFloat(total_coll) - parseFloat(agreed_remittance)) < 0 ? 'red' : 'green' }}
  >
    {isFinite(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100) ? parseFloat(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100).toFixed(2) : '0'}
    {/* {parseFloat(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100).toFixed(2)} */}
  </Typography>
</td>

{/* <td className="p-1 border-2 w-[30px]">
  <Typography
    variant="small"
    className="font-normal"
    style={{ color: isFinite(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100) ? ((parseFloat(total_coll) - parseFloat(agreed_remittance)) < 0 ? 'red' : 'green') : 'black' }}
  >
    {isFinite(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100) ? parseFloat(((parseFloat(total_coll) - parseFloat(agreed_remittance)) / parseFloat(agreed_remittance)) * 100).toFixed(2) : '0'}
  </Typography>
</td> */}


                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat((parseFloat(cash_1/2)+parseFloat(agreed_remittance))*(tcs/100)).toFixed(2)}
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
                  <td  className='p-1 border-2 text-left font-bold'>
                          
                  </td>
                  {/* <td  className='p-1 border-2 text-left font-bold'>
                          
                  </td> */}
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['cash_1']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['cash_2']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['monthly_pass_amount']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['gross_cash_rec']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_fast_tag_cl']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_coll']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_expense_from_ho']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['expense_from_tp']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['total_exp']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['net_coll']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['non_fst_tg_pnlty']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['agreed_remittance']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['margin_without_expense']}
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['p/l']}
                  </td>
                  <td  className={`p-1 border-2 text-right font-bold ${total_consolidate['per']?'text-green-700':'text-red-700'}`}>
                  {total_consolidate['per']} 
                  </td>
                  <td  className='p-1 border-2 text-right font-bold'>
                  {total_consolidate['tcs']} 
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
