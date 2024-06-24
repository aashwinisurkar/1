import React, { useState,useEffect } from "react";
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import {
  TrashIcon
} from "@heroicons/react/24/solid"; 

const TABLE_HEAD = ['Sr.no','Expense','Amount','Voucher No','Narration',''];
// let index = 0;

export default function Operatorpreport({onCompleteTask,date_entry}) {
    const [pname,setpname]  = useState('');
    const [rowData, setRowData] = useState([]);
    const [options,setoptions] = useState([]);
    const [datetd,setdatetd] = useState('');
    const [plaza_id,setplaza_id] = useState('');
    const [user_id,set_user_id] = useState('');
    const [rem,setrem] = useState('');
    const [oi,setoi] = useState('');
    const [rep_entry,set_rep_entry] = useState('');
    const [show_salary,setsalary] = useState('');
    const [sal_alert,setsalalert] = useState(false);
    const [salpaid,setsalpaid] = useState('');
    const [salfetch,setsalfetch] = useState('');

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

    const handleRowInputChange = (index, fieldName, value) => {
      // console.log(rowData);
      // console.log("Index: ",index,"field: ", fieldName,"value: ",value);
      if(fieldName === 'id' && (value == 15 || value == 16 || value == 32)){
        const decrydata = decryptAndRetrieveData("Harry");
        fetch(api+'getsalamount',{
              method:'POST',
              body: JSON.stringify({ date_rep: datetd, plaza: decrydata.user.pid  }),
              })
            .then((response) => response.json())
            .then((data) => 
            setsalfetch(data[0])
             )
              .catch((error) =>{
              console.log(error);
              },[]);

        console.log(salfetch)
      }
      const updatedRows = [...rowData];
      updatedRows[index][fieldName] = value;
      setRowData(updatedRows);
      const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
      handleInputChange("cash_kpt", totalExpenseAmount);

  };
  function checkAllIdsPresent(rows) {
    return rows.every(row => 'id' in row && row.id !== '');
  }

  function checkAllnarrationPresent(rows) {
    return rows.every(row => 'narration' in row && row.narration !== '');
  }

  function checkAllvoucherPresent(rows) {
    return rows.every(row => 'voucherno' in row && row.voucherno !== '');
  }

    const handleAddRow = () => {
      const newRow = {
        id: '',
        amount: '',
        voucherno: '',
        narration: ''
      };
      setRowData([...rowData, newRow]);
      // console.log(rowData);
    };
    const [formData, setFormData] = useState({
      date_rep:"",
      opening_amt: '',
      adv_from_ho :"",
      total_cash_recievable : "",
      balaji : "",
      monthly_pass_amt : "",
      gross_cash_rec : "",
      total_cash : "",
      total_cash_rec : "",
      short_excess_tc : "",
      cash_dep_bank : "",
      cash_dep_arcpl : "",
      cash_kpt : "",
      diff_cash_tp : "",
      total_fast_tag_cl : "",
      short_amt_adj : 0,
      excess_amt_adj : 0,
      total_fast_tag_rec : "",
      fst_tg_trf_bnk : 0,
      diff_reciev : "",
      total_coll : "",
      plaza_code : "",
      user_id : "",
      test:"",
      name:"",
      salary:"",
      expensetype:[],
      remitance:"",
      on_monthly_pass_amt:""
    
  });

  

  const handleDeleteRow = (index) => {
    // console.log(index);
    // console.log(rowData);
  const updatedRows = [...rowData];
    updatedRows.splice(index, 1);
    setRowData(updatedRows);
    // console.log(updatedRows);
};

const nextdate = (value) => {
    const checkdate = new Date(value);
    checkdate.setDate(checkdate.getDate() + 1);
    console.log(date_entry);
    const formattedDate = checkdate.toISOString().slice(0, 10);
    // console.log(formattedDate);
    setdatetd(formattedDate);
    set_rep_entry(formattedDate);
  }

  const nextdate1 = (value) => {
    const checkdate = new Date(value);
    checkdate.setDate(checkdate.getDate() + 1);
    console.log(date_entry);
    const formattedDate = checkdate.toISOString().slice(0, 10);
    // console.log(formattedDate);
    // setdatetd(formattedDate);
    // set_rep_entry(formattedDate);
    return formattedDate;
  }

const formatDate1 = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const handleDateChange = (fieldName,value) =>{
  const enteredDate = new Date(value);
  const today = new Date();
  const decrydata = decryptAndRetrieveData("Harry");
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: value, plaza: decrydata.user.pid  }),
  })
  .then((response) => response.json())
  .then((data) => 
  handleInputChange("opening_amt", data.oa)
  // console.log(data)
  )
  .catch((error) =>{
    console.log(error);
  },[]);

  fetch(api+'getrem',{
    method:'POST',
    body:JSON.stringify({plaza_code:decrydata.user.pid,date_rep:value})
  })
  .then((response)=> response.json())
  .then((data)=>
  // console.log(data.remitance)
  setrem(data.remitance)
  )
  .catch((error)=>{
    console.log(error);
  },[]);

  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: formData.test, plaza: decrydata.user.pid  }),
})
.then((response) => response.json())
.then((data) => 
handleInputChange("initial_opn", data.io)
)
.catch((error) =>{
    console.log(error);
},[]);
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: value, plaza: decrydata.user.pid  }),
  })
  .then((response) => response.json())
  .then((data) => 
  setoi(data.oi)
  // console.log(data)
  )
  .catch((error) =>{
    console.log(error);
  },[]);

if (enteredDate > today) {
setFormData((prevData) => ({
  ...prevData,
  [fieldName]: formatDate1(enteredDate),
}));
}else{ 
  setFormData((prevData) => ({
    ...prevData,
    [fieldName]: value,
  }));
}




};

const handleInputChange = (fieldName,value) =>{
  const floatValue = parseFloat(value);

  if (!isNaN(floatValue) && floatValue >= 0) {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: floatValue,
    }));
  } else {
    if(fieldName === 'opening_amt'){
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: floatValue,
      }));
    }else{
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: 0,
    }));
  }
  }
};

const resetForm = () => {
  setFormData({
    date_rep: '',
    opening_amt: '',
    adv_from_ho :  "",
    total_cash_recievable : "",
    balaji :  "",
    monthly_pass_amt : "",
    gross_cash_rec :  "",
    total_cash :  "",
    total_cash_rec :  "",
    short_excess_tc :  "",
    cash_dep_bank : "",
    cash_dep_arcpl :  "",
    cash_kpt :  "",
    diff_cash_tp :  "",
    total_fast_tag_cl :  "",
    short_amt_adj : 0,
    excess_amt_adj :  0,
    total_fast_tag_rec : "",
    fst_tg_trf_bnk :  0,
    diff_reciev :  "",
    total_coll :  "",
    plaza_code :  "",
    user_id :  "",
    test:  "",
    name: "",
    salary:"",
    expensetype:[],
    remitance:"",
    id:'',
    on_monthly_pass_amt:"",
    initial_opn:""
  });
};

const handlesubmit  = async() =>{
//   const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
 
//   const setEmptyFieldsToZero = (obj) => {
//     for (let key in obj) {
//       if (obj[key] == "") {
//         obj[key] = 0;
//       }
//     }
//     return obj;
//   };
  
//   const deriveddata = {
//     date_rep:formData.test,
//     gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//     total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//     diff_cash_tp:       (parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
//     total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
//     diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
//     total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
//     short_excess_tc:    (parseFloat(formData.total_cash_rec)-(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt))),
//     cash_kpt : totalExpenseAmount,
//     expensetype:    rowData,
//     plaza_code:plaza_id,
//     user_id : user_id,
//     remitance:rem
//   };
//   if(formData.test === ''){
//     alert("Choose Date");
//   }else{
//     const formDataWithDerived = { ...formData, ...deriveddata };
//   const deriveddataWithZeroes = setEmptyFieldsToZero(formDataWithDerived);


//  const res = await fetch(api+'insertplazareport',{
//     method: "POST",
//           crossDomain: true,
//           headers:{              
//               "Content-Type":"application/json",
//               Accept:"application/json",
//               "Access-Control-Allow-Origin":"*",
              
//           },
//           body: JSON.stringify(deriveddataWithZeroes)
//   });
//   if(res.ok){
//     const responseData = await res.json();
//     if(responseData.ResponseCode === "200"){
//       alert("Data Inserted Successfully ");
//       setalert(true);
//     }else{
//       if(responseData.ResponseCode === "402"){
//         alert("Entry Done for Today");
//       }else{
//       }
//     }
//   }
// };
const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
const setEmptyFieldsToZero = (obj) => {
  for (let key in obj) {
    // console.log(key);
    if (obj[key] == "") {
      obj[key] = 0;
      // if(obj[key] == NaN){
      //   obj[key] = 0;
      // }
    }
  }
  return obj;
};

const setEmptyFieldsToZero1 = (obj) => {
  for (let key in obj) {
    // console.log(key);
      obj[key] = 0;
      // if(obj[key] == NaN){
      //   obj[key] = 0;
      // }
    
  }
  return obj;
};

const formDataWithDerived = { ...formData};
const formData1 = setEmptyFieldsToZero(formDataWithDerived);
// console.log(deriveddataWithZeroes);
if(formData.test){
const deriveddata1 = {
  date_rep:formData.test,
  gross_cash_rec:     parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt),
  total_cash:         parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt),
  diff_cash_tp:       (parseFloat(formData1.opening_amt)+parseFloat(formData1.adv_from_ho)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt)+parseFloat(formData1.total_cash_recievable))-(formData1.cash_dep_bank+formData1.cash_dep_arcpl+formData1.cash_kpt),
  total_fast_tag_rec: (parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj),
  diff_reciev :       parseFloat(formData1.fst_tg_trf_bnk) - ((parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj)),
  total_coll:         ((parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj))+(parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt)),
  short_excess_tc:    (parseFloat(formData1.total_cash_rec)-(parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt))),
  cash_kpt : totalExpenseAmount,
  expensetype:    rowData,
  plaza_code:plaza_id,
  user_id : user_id,
  remitance:rem
};
const formDataWithDerived1 = { ...formData1, ...deriveddata1 };
const deriveddataWithZeroes1 = setEmptyFieldsToZero(formDataWithDerived1);
if(rep_entry === deriveddataWithZeroes1.date_rep || rep_entry === deriveddataWithZeroes1.test || deriveddataWithZeroes1.test === date_entry){

if(!checkAllIdsPresent(rowData)){
  alert("Enter All Expenses");
  return;
}
// console.log("hi",rowData);
if(!checkAllnarrationPresent(rowData)){
  alert("Enter All narration");
  return;
}
if(!checkAllvoucherPresent(rowData)){
  alert("Enter Voucher Number Details");
  return;
}

const res = await fetch(api+'insertplazareport',{
  method: "POST",
        crossDomain: true,
        headers:{              
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
            
        },
        body: JSON.stringify(deriveddataWithZeroes1)
});
if(res.ok){
  const responseData = await res.json();
  console.log(responseData);
  if(responseData.ResponseCode === "200"){
    resetForm();
    onCompleteTask();
    alert(responseData.ResponseMsg);
    // setalert(true);
    // resetForm();
    const data = setEmptyFieldsToZero1(formData);
      // setFormData(data);
      
  }else{
    if(responseData.ResponseCode === "402"){
      alert("Entry already submitted for this date");
      resetForm();
    }else{
      // console.log(responseData);
      // console.log(res);
      if(responseData.ResponseCode === "403"){
        alert("Please Select Proper date");
        resetForm();
      }else{
      resetForm();
    }
    }
  }
}
}else{
  alert("Please Select Proper Date");
}
}else{
  
const deriveddata1 = {
  date_rep:datetd,
  gross_cash_rec:     parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt),
  total_cash:         parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt),
  diff_cash_tp:       (parseFloat(formData1.opening_amt)+parseFloat(formData1.adv_from_ho)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt)+parseFloat(formData1.total_cash_recievable))-(formData1.cash_dep_bank+formData1.cash_dep_arcpl+formData1.cash_kpt),
  total_fast_tag_rec: (parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj),
  diff_reciev :       parseFloat(formData1.fst_tg_trf_bnk) - ((parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj)),
  total_coll:         ((parseFloat(formData1.total_fast_tag_cl)+parseFloat(formData1.short_amt_adj)) - parseFloat(formData1.excess_amt_adj))+(parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt)),
  short_excess_tc:    (parseFloat(formData1.total_cash_rec)-(parseFloat(formData1.total_cash_recievable)+parseFloat(formData1.balaji)+parseFloat(formData1.monthly_pass_amt))),
  cash_kpt : totalExpenseAmount,
  expensetype:    rowData,
  plaza_code:plaza_id,
  user_id : user_id,
  remitance:rem
};
const formDataWithDerived1 = { ...formData1, ...deriveddata1 };
const deriveddataWithZeroes1 = setEmptyFieldsToZero(formDataWithDerived1);
// console.log(datetd);
if(rep_entry === deriveddataWithZeroes1.date_rep){
  if(!checkAllIdsPresent(rowData)){
    alert("Enter All Expenses");
    return;
  }
  if(!checkAllnarrationPresent(rowData)){
    alert("Enter All Narration");
    return;
  }
  if(!checkAllvoucherPresent(rowData)){
    alert("Enter All Voucher Number's")
    return;
  }
const res = await fetch(api+'insertplazareport',{
  method: "POST",
        crossDomain: true,
        headers:{              
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
            
        },
        body: JSON.stringify(deriveddataWithZeroes1)
});
if(res.ok){
  const responseData = await res.json();
  console.log(responseData);
  if(responseData.ResponseCode === "200"){
    // alert("Data Inserted Successfully ");
    alert(responseData.ResponseMsg);
    onCompleteTask();
    resetForm();
    // setalert(true);
    const data = setEmptyFieldsToZero1(formData);
      setFormData(data);
      
  }else{
    if(responseData.ResponseCode === "402"){
      alert("Entry already submitted for this date");
      resetForm();
    }else{
      // console.log(responseData);
      // console.log(res);
      resetForm();
    }
  }
}
  }else{
    alert("Please Select Proper Date");
  }
}
}

  useEffect(() => {
    const decrydata = decryptAndRetrieveData("Harry");
    // console.log(decrydata);
    const currentDate = new Date().toISOString().split('T')[0];
    // console.log(currentDate);
    // setdatetd(currentDate);
    setplaza_id(decrydata.user.pid);
    set_user_id(decrydata.user.id);
    const setEmptyFieldsToZero = (obj) => {
      for (let key in obj) {
        // console.log(key);
        if (obj[key] == "") {
          obj[key] = 0;
        }
      }
      return obj;
    };
    let i = 0;
    if(i<2){
      const data = setEmptyFieldsToZero(formData);
      setFormData(data);
      i++;
    }
  //   if(i<2){
  //   handleDateChange(currentDate);
  //   i++;
  // }
  let j  = 0;
  if(j<2){
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: nextdate1(date_entry), plaza: decrydata.user.pid  }),
})
.then((response) => response.json())
.then((data) => 
handleInputChange("opening_amt", data.oa)
// console.log(data)
)
fetch(api+'getoa',{
  method:'POST',
  body: JSON.stringify({ date: nextdate1(date_entry), plaza: decrydata.user.pid  }),
})
.then((response) => response.json())
.then((data) => 
setoi(data.oi)
// console.log(data)
)
j++;
  }
// .catch((error) =>{
//     console.log(error);
// },[]);

fetch(api+'getrem',{
  method:'POST',
  body:JSON.stringify({plaza_code:decrydata.user.pid,date_rep:nextdate1(date_entry)})
})
.then((response)=> response.json())
.then((data)=>
// console.log(data.remitance)
setrem(data.remitance)
)
.catch((error)=>{
  console.log(error);
},[]);

    fetch(api+'getplazastat',{
        method:'POST',
        body: JSON.stringify({'plaza':decrydata.user.pid})
      })
        .then((response) => response.json())
        .then((data) => {
          setpname(data.data.plaza)
        });

        fetch(api+'expensehead')
      .then((response) => response.json())
      .then((data) => {
        // setOptions(data); // Set the fetched data to the options state
        // console.log(data);
        setoptions(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

      let i4 = 0;
      if(i4<2){
        nextdate(date_entry);
        i4++;
      }

      // const decrydata = decryptAndRetrieveData("Harry");
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: nextdate1(date_entry), plaza: decrydata.user.pid  }),
  })
  .then((response) => response.json())
  .then((data) => 
  handleInputChange("opening_amt", data.oa)
  // console.log(data)
  )
  .catch((error) =>{
    console.log(error);
  },[]);

  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: nextdate1(date_entry), plaza: decrydata.user.pid  }),
})
.then((response) => response.json())
.then((data) => 
handleInputChange("initial_opn", data.io)
)
.catch((error) =>{
    console.log(error);
},[]);
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: nextdate1(date_entry), plaza: decrydata.user.pid  }),
  })
  .then((response) => response.json())
  .then((data) => 
  setoi(data.oi)
  // console.log(data)
  )
  .catch((error) =>{
    console.log(error);
  },[]);

  },[]);

  return (
    <>
    {/* <Card> */}
    {/* <div className="px-5"> */}
    <div className=' w-full  flex pt-1'>
    <div className='w-full  px-0'>
    <div className="flex justify-center items-center">
     <div className="w-full pt-1  justify-center items-center">
        <div className="rounded-t bg-indigo-500 mb-0 py-2">
      <div className="text-center">
        <h6 className="text-white text-2xl font-bold">
          PLAZA ENTRY
          {/* {pname.toUpperCase()} */}
        </h6>
      </div>
    </div>
    </div>
    </div>
    <div className="w-full h-full bg-white ">
    <form className=" h-full w-full  ">
            {/* <div className=" overflow-scroll"> */}
           
                <div className=" py-1  justify-center items-center ">
                <div className="px-2  flex   flex-col lg:flex-row  lg:items-center sm:items-center   justify-center ">
            <div className="ml-[5px] mt-3  flex mb-3">
              <label className="uppercase text-blueGray-600 text-[17px] flex justify-center items-center font-bold mb-2 px-2" htmlfor="grid-password">
                Date
              </label>
              <input type="date" className="border-2  px-3  py-2 placeholder-blueGray-300 text-blueGray-600 bg-white  border-gray-400  border-solid rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring  ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{handleDateChange("test", e.target.value)}}
              defaultValue={datetd}
              />
            </div>

            {/* <div className="ml-[40px] mt-3 flex mb-3">
              <label className="uppercase text-blueGray-600 text-[15px] flex justify-start items-center font-bold mb-2 me-2 " htmlfor="grid-password">
              Choose Plaza
              </label>
              <select
            id="option1"
            name="option"
            value={pid}
            onChange={(e) => openingamount(e.target.value)}
            className="w-[180px] border-2 py-2 border-gray-400 rounded-md px-2 "
          >
            <option value="" >Select Plaza</option>
            {plaza.map((option) => (
              <option  value={option.plaza_id}>
                {option.name}
              </option>
            ))}
          </select>
            </div> */}

           

          </div>
     <div className=" flex-grow-1 ">
                    
   <div className="flex flex-col lg:flex-row ">
             
   <div className="border rounded-xl py-2 px-2 border-gray-300 shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90-md m-1 max-w-[317px]">

                          
          {/* summary start */}
      <Card className="h-full w-full border rounded-lg  min-w-[300px]">
      <div className="flex  bg-blue-600 py-1  border rouinded-lg py-1 justify-center items-center mb-[-20px]">
        <h2 className="font-bold text-[17px] text-white  ">SUMMARY</h2>
        </div>
      <div className="flex flex-col justify-start w-full mx-2 my-3">
  <div className="  items-start  flex">

  <div className="w-full font-bold my-3 mx-0 text-[13px]">
  <div className="flex  justify-center  items-center p-3">
        <div className="left-0 uppercase  flex-initial   sm:w-[130px]">Opening Amount:</div>
        <input type="number" placeholder="Opening Amount" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"  
        defaultValue={oi} disabled/>
      </div>
      <div className="flex justify-center items-center   p-4">
        <div className="left-0 uppercase  flex-initial   sm:w-[130px]">TOTAL CASH RECEIVES:</div>
        <input type="number" placeholder="Total cash received" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
         value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)}
         disabled /> 
      </div>
      <div className="flex justify-center items-center w-full p-4">
        <div className="left-0 uppercase  flex-initial     sm:w-[130px]">TOTAL FASTACK RECEIVES:</div>
        <input type="number" placeholder="TOTAL FAST TAG RECEIVABLE" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"  
        value={parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
        disabled />
      </div>
      <div className="flex justify-center items-center w-full p-4">
        <div className="left-0 uppercase  flex-initial    sm:w-[130px]">TOTAL COLLECTION:</div>
        <input type="number" placeholder="Total collection" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"  
        value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
        disabled />
      </div>
      <div className="flex justify-center items-center w-full p-4">
        <div className="left-0 uppercase  flex-initial   sm:w-[130px]">TOTAL EXPENCES:</div>
        <input type="text" placeholder="Total expenses" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
         value={(formData.cash_kpt)}
         disabled   />
      </div>
      <div className="flex justify-center items-center w-full p-4">
        <div className="left-0 uppercase  flex-initial    sm:w-[130px]">CLOSING BALANCE:</div>
        <input type="number" placeholder="Closing amount " className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
          value={ parseFloat(oi)+parseFloat(formData.adv_from_ho)+parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)-parseFloat(formData.cash_dep_arcpl)-parseFloat(formData.cash_kpt)}
          disabled  />
      </div>
   
     
      
    </div>
  </div>
  </div>
  <div className="  mb-2 px-2 flex justify-center  items-center ">
                          <Button color="green" onClick={handlesubmit}>Submit</Button>
                        </div>
</Card>
               {/* SUMMARY REPORT END  */}
        
          </div> 

         
          <div className="  flex-grow  flex-wrap m-1 border border-gray-300 rounded-lg md:w-[1000px] ">

        <div className=" flex flex-col sm:flex-row  w-full  p-2 ">  
            {/* COLLECTION REPORT */}
            
                <Card className="  flex-grow flex-wrap   ">
                  <div className="flex-col lg:flex-row ">
            <div className="flex  bg-blue-600 justify-center items-center border rounded-lg  py-1">
              <h2 className="text-white text-[17px] font-bold">COLLECTION
                </h2>
                </div>
          
          <div className="flex-wrap w-full  justify-start items-start grid grid-cols-1 me-2 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full ">

          <div className="   ml-5 flex justify-left  items-start py-1">
         
      <div className="left-0 uppercase font-bold text-[12px] flex-initial ml-[20px] py-2 me-2 sm:w-[120px] sm:ml-0"> ADVANCE FROM HO:</div>
      <input type="text" placeholder="Advance from H.O" className="border-2 sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
      value={formData.adv_from_ho}
        onChange={(e) => handleInputChange("adv_from_ho", e.target.value)}
         />
    </div>
    <div className="  flex justify-left items-center  p-2">
   <div className="left-0 uppercase font-bold text-[12px]  flex-initial ml-[40px] py-1 me-2 sm:w-[130px]">CASH DEPOSITE IN ARCPL:</div>
        <input type="text" placeholder="IN ARCPL" className="border-2  sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
         value={formData.cash_dep_arcpl}
         onChange={(e) => handleInputChange("cash_dep_arcpl", e.target.value)} />
     </div>

    </div>   
    <div className="flex-wrap  justify-start items-start  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full ">
            
            <div className="  ml-5  flex justify-left  items-start ">
           
            <div className="left-0 uppercase  flex-initial ml-[20px] py-2 font-bold text-[12px]  me-2  sm:w-[120px] sm:ml-0"> CASH 1:</div>
        <input type="text" placeholder="CASH 1" className="border-2 sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
        value={formData.total_cash_recievable}  onChange={(e) => handleInputChange("total_cash_recievable", e.target.value)} />
      </div>
      <div className="  flex justify-left items-center w-full  p-2">
          <div className="left-0 uppercase font-bold text-[12px]  flex-initial ml-[40px] py-1 me-2 sm:w-[130px]">CASH DEPOSITE IN BANK:</div>
          <input type="text" placeholder="CASH DEPOSITE IN BANK" className="border-2  sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
       value={formData.cash_dep_bank}
       onChange={(e) => handleInputChange("cash_dep_bank", e.target.value)} />
       </div>
  
      </div>   
      <div className="flex-wrap  justify-start item-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full ">
            
            <div className="  ml-5  flex justify-left  items-start ">
           
            <div className="left-0 uppercase  flex-initial ml-[20px] py-2 font-bold text-[12px]  me-2  sm:w-[120px] sm:ml-0">Cash 2</div>
        <input type="text" placeholder="Cash 2" className="border-2 sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={formData.balaji}
        onChange={(e) => handleInputChange("balaji", e.target.value)}  />
      </div>
      <div className="  flex justify-left items-center w-full  p-2">
          <div className="left-0 uppercase font-bold text-[12px] flex-initial ml-[40px] py-1 me-2  sm:w-[130px]">ONLINE MONTHLY PASS AMOUNT:</div>
          <input type="text" placeholder="MONTHLY PASS AMOUNT" className="border-2  sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
           value={formData.on_monthly_pass_amt}  onChange={(e) => handleInputChange("on_monthly_pass_amt", e.target.value)} /> 
       </div>
  
      </div>   
      <div className="flex-wrap  justify-start item-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full ">
            
            <div className="  ml-5  flex justify-left  items-start ">
           
        <div className="left-0 uppercase  flex-initial font-bold text-[12px] py-1 me-2  ml-[20px] sm:w-[120px] sm:ml-0"> FAST TAG COLLECTION:</div>
        <input type="text" placeholder="FAST TAG COLLECTION:" className="border-2 sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
                value={formData.total_fast_tag_cl}  onChange={(e) => handleInputChange("total_fast_tag_cl", e.target.value)}  />
      </div>
      <div className="  flex justify-left items-center w-full  p-2">
          <div className="left-0 uppercase  font-bold text-[12px] flex-initial ml-[40px] py-1 me-2 sm:w-[130px]">MONTHLY PASS AMOUNT:</div>
          <input type="text" placeholder=" MONTHLY PASS AMOUNT:" className="border-2  sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
           value={formData.monthly_pass_amt}   onChange={(e) => handleInputChange("monthly_pass_amt", e.target.value)} 
         />
       </div>
  
      </div>  
      <div className="flex-wrap  justify-start items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full ">
            
            <div className="  ml-5  flex justify-left  items-start ">
           
        <div className="left-0 uppercase  flex-initial py-1 me-2  font-bold text-[12px] ml-[20px] sm:w-[120px] sm:ml-0"> CASH DEPOSITED BY TC</div>
        <input type="text" placeholder="by TC" className="border-2 sm:w-[130px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
       value={formData.total_cash_rec}
       onChange={(e) => handleInputChange("total_cash_rec", e.target.value)} />
      </div>
     
  
      </div>    
      </div></Card>
              </div>
              {/* COLLECTION REPORT END */}
              <div>
                
              </div>
<div className=" flex-grow flex-wrap   mx-2">
<div className=" flex flex-col sm:flex-row md:flex-row ">
  {/* EXPENSE REPORT  */}
<Card className="h-full flex-grow  flex-wrap   border rounded-lg py-2 overflow-scroll">
<div className="flex  bg-blue-600 justify-center items-center border rounded-lg  py-1">
              <h2 className="text-white text-[17px] font-bold">EXPENSES
                </h2>
                </div>
   <table className="  text-left">
                                                                <thead>
                                                                    <tr>
                                                                        {TABLE_HEAD.map((head) => (
                                                                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 mx-auto  py-2 px-3">
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="blue-gray"
                                                                                    className="font-bold leading-none  mx-auto  flex justify-center items-center "
                                                                                >
                                                                                    {head}
                                                                                </Typography>
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rowData.map((row, rowIndex) => (
                                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even:bg-blue-gray-50/50' : ''}>
                                                                            <td className="  p-1 w-[1px] border-2 ">
                                                                                <Typography variant="small" color="blue-gray" className="font-bold flex justify-center items-center">
                                                                                    {rowIndex + 1}
                                                                                </Typography>
                                                                            </td>
                                                                            <td className=" border-2 w-[7px]">
                                                                           
                                                                                <select
            id="option"
            name="option"
            onChange={(e) => handleRowInputChange(rowIndex,'id',e.target.value)}
            value={row.id}
            className="w-[150px] border border-gray-300 rounded-md p-2 h-[37px] uppercase"
          >
            <option value="" className="font-normal  text-15px]">Select Expense</option>
            {options.map((option) => (
              <option  value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
                                                                            </td>
                                                                            <td className="p-1 border-2 w-[50px]">
                                                                                <input type="text" placeholder="Amount" className="border-2 sm:w-[120px] sm:ml-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all "
                                                                                 onChange={(e) => handleRowInputChange(rowIndex,'amount',e.target.value)}
                                                                                 value={row.amount} />
                                                                            </td>
                                                                            <td className="p-1 border-2 w-[90px]">
                                                                                <input type="text" placeholder="Voucher No" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150 w-[80px]"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'voucherno',e.target.value)}
                                                                                value={row.voucherno} />
                
                                                                           </td>
                                                                       <td className="p-1 border-2 ">
                                                                                
                                                                                 <textarea
                                                                             placeholder="Narration" 
                                                                           className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded
                                                                            text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring h-[40px] w-full   "
                                                                          onChange={(e) => handleRowInputChange(rowIndex, 'narration', e.target.value)}
                                                                       value={row.narration}
                                                                           rows={1}
                                                                      // style={{ minHeight: '27px', maxHeight:"600px" }} 
                                                                            />
                                                                            </td>











              {/* <td className="p-1 border-2 mx-auto">
                <button
                  className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90 focus:outline-none focus:ring w-[80px] h-auto"
                  onClick={(e) =>{ e.preventDefault(); handleEditNarration(rowIndex)}}
                >
                   Narration
                </button>
              </td> */}


 <td className="p-4 border-2 w-[10px]">
                 {/* <Button color="red" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button> */}
                     <TrashIcon color="red" onClick={() =>handleDeleteRow(rowIndex)}
                          className="h-5 ml-[20px] cursor-pointer"/>
                          </td>
                            </tr>
                              ))}
                                  <tr>
                                   <td colSpan={5} className="p-4 border-2 ">
                                     <Button color="blue" onClick={handleAddRow}>Add Row</Button>
                                       </td>
                                       </tr>
                                          </tbody>
                                    </table>
                                    {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-gray-500/50 shadow-lg dark:shadow-lg dark:shadow-gray-900/90-lg max-w-md w-full">
            <h2 className="text-xl mb-4">Edit Narration</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows="5"
              value={currentNarration}
              onChange={(e) => setCurrentNarration(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="mr-2 bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSaveNarration}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}
   </Card>
   </div>
   {/* EXPENSE REPORT END  */}
</div>









            </div>
            
            </div>
            

          </div> 
          </div>   
                     
    </form>
    </div>
    
    </div>
   
    </div>
    {/* </div> */}
    {/* </Card> */}
    </>
  )
}

