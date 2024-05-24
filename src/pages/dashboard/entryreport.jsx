import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Chip, Button,CardFooter } from "@material-tailwind/react";
import api from "@/ApiLink.mjs";
import CryptoJS from 'crypto-js';
// import AddTollUser from '@/AddTollUser';
// import PlazaReport from '@/PlazaReport';
// import OperatorPlazareport from '@/OperatorPlazareport';
import Operatorpreport from '@/Operatorpreport';
import Updateplazapreport from '@/Updateplazapreport';
import {
  XMarkIcon ,
  PencilSquareIcon,
  ArrowPathIcon
} from "@heroicons/react/24/solid";

const PAGE_SIZE = 10;
const TABLE_HEAD1 = ["Sr no","Date", "Opening Amount", "Advance from H.O", "TOTAL CASH RECEIVABLE AS PER SYSTEM","balaji","Monthly Pass Amount","Online Monthly Pass Amount","GROSS CASH RECEIVABLE FROM TOLL PLAZA","TOTAL CASH RECEIVED FROM TC INCLUDING BALAJI CASH RECEIPTS","TOTAL RECEPTS FROM TC","SHORT/EXCESS COLLECTION FROM TC","CASH DEPOSITED DIRECTLY TO BANK","CASH DEPOSITED IN ARCPL OFFICE","CASH KEPT FOR EXPENSES","SALARY","DIFFERENCE CASH IN TOLL PLAZA","TOTAL FAST TAG COLLECTION","SHORT AMOUNT ADJUSTMENT","EXCESS AMOUNT ADJUSTMENT","TOTAL FAST TAG RECEIVABLE","FAST TAG AMOUNT TRANSFER TO BANK A/C","DIFFERENCE RECEIVABLE","TOTAL COLLECTION","ACTIONS"];

export function Entryreport() {
const [currentPage, setCurrentPage] = useState(1);
  const [plazaModalOpen, setPlazaModalOpen] = useState(false);
  const [cstat,setstat] = useState('');
  const [tablef,settablef] = useState(false);
  const [updtbf,setupdtbf] = useState(true);
  const [report,setreport] = useState([]);
  const [TABLE_ROWS,setrows] = useState([]);
  const [uid,setuid] = useState('');
  const [plaza,setplaza] = useState('');
  const [data,setdata] = useState('');

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }

  const openPlazaModal = () => {
    setPlazaModalOpen(true);
  };

  const closePlazaModal = () => {
    setPlazaModalOpen(false);
  };

  const updateplazarep = (rowData) => {
    
    // setopen(!fopn);
    // setshowTable(!showTable);
    // console.log("hi");
    settablef(true);
    setupdtbf(false);
    setreport(rowData);
  }

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const displayedRows = TABLE_ROWS.slice(startIdx, endIdx);

  const totalPages = Math.ceil(TABLE_ROWS.length / PAGE_SIZE);


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


  const changePage = (page) => {
    setCurrentPage(page);
  };

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
  
  const handleGetResult = () =>{
    settablef(true);
    setupdtbf(true);
  }

  const toggleComponentVisibility = () => {
    const decrydata21 = decryptAndRetrieveData("Harry");
    fetch(api+'operator_plaza_7',{
      method:'POST',
      body: JSON.stringify({plaza: decrydata21.user.pid })
      
    })
    .then((response)=>response.json())
    .then((data)=> setrows(data.data))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });

    fetch(api+'getend',{
      method:'POST',
      body: JSON.stringify({plaza: decrydata21.user.pid })
      
    })
    .then((response)=>response.json())
    .then((data)=> 
    setplaza(data.Data[0].Last_entry)
  // console.log(data)
  // setdata(data)
  )
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });

    settablef(false);
    resetform();
    // setreport(null);
  };

  const resetform = () =>{
    settablef(false);
  }
  const checkstatus = () =>{
    const decrydata = decryptAndRetrieveData("Harry");
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
  const decrydata = decryptAndRetrieveData("Harry");

  useEffect(() => {
    if (!decrydata) {
      window.location.href = '/';
    }
    const refresh = setInterval(checkstatus,20000);
    if(cstat=='403'){
      window.location.href='/';
    }
    const decrydata21 = decryptAndRetrieveData("Harry");
    setuid(decrydata21.user.id);
    fetch(api+'operator_plaza_7',{
      method:'POST',
      body: JSON.stringify({plaza: decrydata21.user.pid })
      
    })
    .then((response)=>response.json())
    .then((data)=> setrows(data.data))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });

    fetch(api+'getend',{
      method:'POST',
      body: JSON.stringify({plaza: decrydata21.user.pid })
      
    })
    .then((response)=>response.json())
    .then((data)=> 
    setplaza(data.Data[0].Last_entry)
  // console.log(data.Data[0].Last_entry)
  // setdata(data)
  // console.log(data)
  )
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });

    
  
  }, [cstat]);

  // console.log(plaza);

  return (
    <>
      
     <div className=" mt--[40px] items-center justify-center mb-[100px] ">
    {tablef?
    <>
     {updtbf?
     <>
     <div className='flex justify-end mt-6'>
     <XMarkIcon
     className=' mt-[2px] ml-2 h-10 cursor-pointer'
     onClick={resetform}
     />
     </div>
      <Operatorpreport
      date_entry = {plaza}
      onCompleteTask={toggleComponentVisibility}/>
      </>
    : 
    <>
    <div className='flex justify-end mt-6'>
     <XMarkIcon
     className=' mt-[2px] ml-2 h-10 cursor-pointer'
     onClick={resetform}
     />
     </div>
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
    </>
    }
    </>
      :
      <div className="overflow-x-auto w-[100%] mt-20">
        <div className='flex justify-end'>
        <Button className='mx-5 mb-5' color='blue' 
        onClick={handleGetResult}
        >
              Plaza Entry
          </Button>
          </div>
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD1.map((head) => (
                  <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[120px] font-bold">
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
            </thead>
            <tbody>
              {displayedRows.map(({ date_rep, opening_amt,id, adv_from_ho,total_cash_recievable,balaji,monthly_pass_amt,gross_cash_rec,salary,total_cash,total_cash_rec,short_excess_tc,cash_dep_bank,cash_dep_arcpl,cash_kpt,diff_cash_tp,total_fast_tag_cl,short_amt_adj,excess_amt_adj,on_monthly_pass_amt,total_fast_tag_rec,fst_tg_trf_bnk,diff_reciev,total_coll,operator,plaza_code,initial_opn }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[50px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {fdate(date_rep)}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
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
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {adv_from_ho}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash_recievable}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {balaji}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {monthly_pass_amt}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {on_monthly_pass_amt}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {gross_cash_rec}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_cash_rec}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {short_excess_tc}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_dep_bank}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_dep_arcpl}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {cash_kpt}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {salary}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {parseFloat(diff_cash_tp)+parseFloat(initial_opn)}
                    </Typography> 
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_fast_tag_cl}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {short_amt_adj}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {excess_amt_adj}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_fast_tag_rec}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {fst_tg_trf_bnk}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {diff_reciev}
                    </Typography>
                  </td>
                  <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {total_coll}
                    </Typography>
                  </td>
                  {/* <td className="p-4 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {operator}
                    </Typography>
                  </td> */}
                  {/* <td className="p-4 border-2">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {operator}
                    </Typography>
                  </td> */}
                  {/* {edit ?(
                  
                  ):null} */}
                  <td className="p-4 border-2 w-[30px]">
                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium text-center">
                      <button className='  h-5 w-5'><PencilSquareIcon color='green'
                      onClick={() => updateplazarep({date_rep, id,opening_amt, adv_from_ho,total_cash_recievable,balaji,monthly_pass_amt,gross_cash_rec,salary,total_cash,total_cash_rec,short_excess_tc,cash_dep_bank,cash_dep_arcpl,cash_kpt,diff_cash_tp,total_fast_tag_cl,short_amt_adj,excess_amt_adj,total_fast_tag_rec,fst_tg_trf_bnk,diff_reciev,total_coll,operator,plaza_code,on_monthly_pass_amt})}
                      />
                      </button>
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='flex justify-center m-2'>
          <Typography variant="small" color="blue-gray" className="mr-2">
              Page {currentPage} of {totalPages}
            </Typography>
            </div>
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
          </div>
        </Card>
      </div>
    }
     </div>
      
    </>
  );
}

export default Entryreport;