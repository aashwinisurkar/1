import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Chip, Button,CardFooter } from "@material-tailwind/react";
import api from "@/ApiLink.mjs";
import CryptoJS from 'crypto-js';
// import AddTollUser from '@/AddTollUser';
// import PlazaReport from '@/PlazaReport';
// import OperatorPlazareport from '@/OperatorPlazareport';
// import Operatorpreport from '@/Operatorpreport';
import Adminpreport from '@/Adminpreport';
// import Hoexpense from '@/Hoexpense';
import HoReport from '@/HoReport';
import {
  XMarkIcon 
} from "@heroicons/react/24/solid";

export function HoexpDetail() {
//   const [TABLE_ROWS, SET_TABLE_ROWS] = useState([]);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [user , setuser] = useState(false);
  const [plazaModalOpen, setPlazaModalOpen] = useState(false);
  const [cstat,setstat] = useState('');

  const openPlazaModal = () => {
    setPlazaModalOpen(true);
  };

  const closePlazaModal = () => {
    setPlazaModalOpen(false);
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
    // const refresh = setInterval(checkstatus,20000);
    if(cstat=='403'){
      window.location.href='/';
    }
  }, []);



  return (
    <>
      
     <div className=" mt--[40px] flex items-center justify-center mb-[100px] ">
     
      <HoReport/>
      
     </div>
      
    </>
  );
}

export default HoexpDetail;