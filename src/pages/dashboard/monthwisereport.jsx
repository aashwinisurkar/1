import React,{useState,useEffect} from "react";
// import Weekly_Rem_Report from "@/Weekly_Rem_report";
import Fin_month_report from "@/Fin_month_report";
import CryptoJS from "crypto-js";
import api from "@/ApiLink.mjs";

export function Month_wise_report() {
  const [showinfo,setshowinfo] = useState(false);
  const [data,setdata] = useState([]);

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
    .then((data)=> setdata(data))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });
  }

  useEffect(() => {
    const dataitem = localStorage.getItem('encryptedData');
    if(dataitem === null){
      window.location.href='/';
    }else{
      setshowinfo(true);
    //   checkstatus();
    // const refresh = setInterval(checkstatus,20000);
    }
  },[]);
  return (
    <>
      {showinfo ? 
      <div className="mx-3 mt-16  lg:mx-4 mb-[480px] ">
      <Fin_month_report />
      </div>
      :<div></div>}

    </>
  );
}

export default Month_wise_report;
