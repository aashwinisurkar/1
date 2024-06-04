import React,{useState,useEffect} from 'react';
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";
import {
    ArrowPathIcon
  } from "@heroicons/react/24/solid";
  import api from './ApiLink.mjs';

  import {
    TrashIcon,PencilSquareIcon
  } from "@heroicons/react/24/solid";
  const TABLE_HEAD1 = ["Sr no","Date", "Plaza Name","Expense no","Amount","Narration","Action"];
  const TABLE_HEAD = ['Sr.no','Expense','Amount','Voucher No','Narration'];
  
export default function HoReport() {

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
  

  //edit ho report

  const [showform,setshowform] = useState(false);
  const [showlist,setshowlist] = useState(true);
  const [showTable,setshowTable] = useState(false);
  const [editrowData, setEditRowData] = useState([]);

  const [datetd,setdatetd] = useState('');
  const [plaza_id,setplaza_id] = useState('');
  const [user_id,set_user_id] = useState('');
  const [rem,setrem] = useState('');

  const [plaza,setplaza] = useState([]);
  const [pid,setpid] = useState(null);
  const [reportid,setreportid] = useState(null);
  const [total_exp,setexp] = useState('');

  const [options,setoptions] = useState([]);

  const handleEditRowInputChange = (index, fieldName, value) => {
    // console.log(rowData);
    const updatedRows = [...editrowData];
    updatedRows[index][fieldName] = value;
    setEditRowData(updatedRows);
    const totalExpenseAmount = editrowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
    handleEditInputChange("cash_kpt", totalExpenseAmount);
    // const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
};

const handleEditInputChange = (fieldName, value) => {
  const floatValue = parseFloat(value);

  if (!isNaN(floatValue) && floatValue >= 0) {
    setEditFormData((prevData) => ({
      ...prevData,
      [fieldName]: floatValue,
    }));
  } else {
    setEditFormData((prevData) => ({
      ...prevData,
      [fieldName]: 0,
    }));
  }
};

const handleEditHoExpense  = (data) =>{
  setshowform(true);
  setshowlist(false);

  setdatetd(data.date_rep);
  // setplaza_id(data.plaza_code);
  setpid(data.plaza_code);
  console.log(data);
  const newRow = {
    id: data.exp_id,
    amount: data.amount,
    voucherno: data.voucher_no,
    narration: data.narration,
  };
  setEditRowData([...editrowData, newRow]);
  openingamount(data.plaza_code);
  let tn=[newRow];
    const totalExpenseAmount = tn.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
    console.log(totalExpenseAmount);
    handleEditInputChange("id", data.id);
    handleEditInputChange("cash_kpt", totalExpenseAmount);
    setreportid(data.report_id);
    edithandleDateChange('test',data.date_rep);
    console.log(data.report_id,'report_id');

  //setEditRowData(updatedRows);





}

const goback = () =>{
  setpid(0);
  //reseteditForm();
  setEditRowData([]);
  console.log(editrowData,'rows');
  setshowform(false);
  setshowlist(true);

  setdatetd(data.date_rep);
  // setplaza_id(data.plaza_code);
  // setpid(0);
  //resetForm();
  // setEditRowData([]);

}



const feditdate = (value) =>{
  const date = new Date(value);
  const formattedDate = '${date.getDate()}-${date.toLocaleString("default", { month: "short" }).toUpperCase()}-${date.getFullYear()}';
  return formattedDate;
}

  const handleEditAddRow = () => {

    
    const newRow = {
      id: '',
      amount: '',
      voucherno: '',
      narration: ''
    };
    setEditRowData([...editrowData, newRow]);
    // console.log(rowData);
  };
  const [editformData, setEditFormData] = useState({
    id:"",
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
    remitance:""
  
});

const handleDeleteRow = (index) => {
  // console.log(index);
  // console.log(rowData);
const updatedRows = [...editrowData];
  updatedRows.splice(index, 1);
  setEditRowData(updatedRows);
  
  // console.log(updatedRows);
};


const edithandleDateChange = async(fieldName,value) =>{
  const enteredDate = editformData.date_rep;
  const today = new Date();
 console.log(fieldName);
if (enteredDate > today) {
setEditFormData((prevData) => ({
  ...prevData,
  [fieldName]: formatDate1(enteredDate),
}));
}else{ 
  setEditFormData((prevData) => ({
    ...prevData,
    [fieldName]: value,
  }));
}
console.log(pid,'pid');
if(pid){
const res = await fetch(api+'getreportid',{
  method: "POST",
  body: JSON.stringify({date: value, plaza: pid})
})
if(res.ok){
  const data = await res.json();
  if(data.ResponseCode === '202'){
     console.log(data.Data[0].id,pid);
    
    setreportid(data.Data[0].id);
  }
}
}
};


const handlesubmit  = async() =>{
  const totalExpenseAmount = editrowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
  const setEmptyFieldsToZero = (obj) => {
    for (let key in obj) {
      // console.log(key);
      if (obj[key] == "") {
        obj[key] = 0;
      }
    }
    return obj;
  };
  const deriveddata = {
    id:editformData.id,
    date_rep:editformData.test,
    gross_cash_rec:     parseFloat(editformData.total_cash_recievable)+parseFloat(editformData.balaji)+parseFloat(editformData.monthly_pass_amt),
    total_cash:         parseFloat(editformData.total_cash_recievable)+parseFloat(editformData.balaji)+parseFloat(editformData.monthly_pass_amt),
    diff_cash_tp:       (parseFloat(editformData.opening_amt)+parseFloat(editformData.adv_from_ho)+parseFloat(editformData.balaji)+parseFloat(editformData.monthly_pass_amt)+parseFloat(editformData.total_cash_recievable))-(editformData.cash_dep_bank+editformData.cash_dep_arcpl+editformData.cash_kpt),
    total_fast_tag_rec: (parseFloat(editformData.total_fast_tag_cl)+parseFloat(editformData.short_amt_adj)) - parseFloat(editformData.excess_amt_adj),
    diff_reciev :       parseFloat(editformData.fst_tg_trf_bnk) - ((parseFloat(editformData.total_fast_tag_cl)+parseFloat(editformData.short_amt_adj)) - parseFloat(editformData.excess_amt_adj)),
    total_coll:         ((parseFloat(editformData.total_fast_tag_cl)+parseFloat(editformData.short_amt_adj)) - parseFloat(editformData.excess_amt_adj))+(parseFloat(editformData.total_cash_recievable)+parseFloat(editformData.balaji)+parseFloat(editformData.monthly_pass_amt)),
    short_excess_tc:    (parseFloat(editformData.total_cash_rec)-(parseFloat(editformData.total_cash_recievable)+parseFloat(editformData.balaji)+parseFloat(editformData.monthly_pass_amt))),
    cash_kpt : totalExpenseAmount,
    expensetype: editrowData,
    plaza_code:pid,
    user_id : user_id,
    remitance:rem,
    rid:reportid
  };
  // const formDataWithDerived = { ...formData, ...deriveddata };
  // console.log(formDataWithDerived);
  const formDataWithDerived = { ...editformData, ...deriveddata };
  const deriveddataWithZeroes = setEmptyFieldsToZero(formDataWithDerived);
  console.log(deriveddataWithZeroes);
  if(reportid){
  const res = await fetch(api+'editHoexpense',{
    method: "POST",
          crossDomain: true,
          headers:{              
              "Content-Type":"application/json",
              Accept:"application/json",
              "Access-Control-Allow-Origin":"*",
              
          },
          body: JSON.stringify(deriveddataWithZeroes)
  });
  if(res.ok){
    const responseData = await res.json();
    if(responseData.ResponseCode === "200"){
      
      alert("Data Inserted Successfully ");
      // setalert(true);
     // resetForm();
      setRowData([]);
    //  window.location.reload();
    
    }else{
      if(responseData.ResponseCode === "401"){
        alert("Some error Occurred");
      }else{
        // console.log(responseData);
        // console.log(res);
      }
    }
  }
}else{
  alert("Please Select valid Date");
}
}



const openingamount = async(value) => {
  console.log(value,'call');
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return` ${year}-${month}-${day}`;
  };
  setpid(value);
  const today = new Date();
  const formattedDate = formatDate(today);

  if(editformData.test){
    const res = await fetch(api+'getreportid',{
      method: "POST",
      body: JSON.stringify({date: editformData.test, plaza: value})
    })
    if(res.ok){
      const data = await res.json();
      // console.log(data.Data);
      if(data.ResponseCode === '202'){
        // console.log(data.Data[0].id);
        setreportid(data.Data[0].id);
      }
    }
    }
// console.log(formattedDate);
  
}


  //end endi ho report 31/05/2024

    const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    plaza_code: '',
    to: currentDate,
    from: currentDate,
  });
  
  const [plazas, setPlazas] = useState([]);
  const [TABLE_ROWS,setrows] = useState([]);
  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate =` ${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }

  const handlePlazaChange = (value) => {
    setshowTable(false);
    setFormData({
      ...formData,
      plaza_code: value,
    });
  };

  const handleGetResult = async(e) => {
    e.preventDefault();
    const res = await fetch(api+'hoexpense_detail',{
      method: "POST",
      body: JSON.stringify(formData)
 }).then(resp => resp.json())
 .then(data => 
  setrows(data)
 );
 setshowTable(true);
  };

  const resetform = async(e) =>{
    setFormData({
      from:currentDate,
      to:currentDate,
      plaza_code: null,
    });
    setshowTable(false);
    // setshowlist()
  }

  useEffect(() => {

    const decrydata = decryptAndRetrieveData("Harry");
   // const currentDate = new Date().toISOString().split('T')[0];
    
    // setdatetd(currentDate);
    // setplaza_id(decrydata.user.pid);
    set_user_id(decrydata.user.id);

    fetch(api+'expensehead')
    .then((response) => response.json())
    .then((data) => {
      setoptions(data);
    })
    .catch((error) => {
      console.error('Error fetching options:', error);
    });
    
    fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        setPlazas(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);

  },[]);

  return (
    
    <>
     {showlist &&
     <>
    <div className='bg-gray-100 h-[100%] mb-[400px]'>
      <div className='my-5 ml-[-70px] flex '>
        <form>
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
          <Button className='mx-5' color='blue' onClick={handleGetResult}>
              Get Result
          </Button>
          <ArrowPathIcon
                className=' mt-[2px] ml-2 h-10 cursor-pointer'
                onClick={resetform}
                />
          </div>
        </form>
        </div>
        {showTable?
        <>
        <div className="overflow-x-auto w-[1000px] border-blue-500 px-4  mt-10">
        <Card className="h-full w-full">
          <table className="w-full min-w-max  table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD1.map((head) => (
                  <th key={head} className="border-2 border-blue-gray-100 bg-blue-500 text-white p-4 w-[30px] font-bold">
                    <Typography
                      variant="normal"
                      color="white"
                      className="font-bold leading-none opacity-90"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(({id,plaza_code,exp_id,voucher_no, date_rep, plaza,name,amount,narration,report_id }, index) => (
                <tr key={date_rep} className="even:bg-blue-100/50 ">
                  <td className="p-3 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[150px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {fdate(date_rep)}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {plaza}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[230px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {amount}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {narration}
                    </Typography>
                  </td>
                  
                  <td className="p-1 border-2 w-[30px] text-center">
                         <div className='flex justify-start items-start'>
                          {/* <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => handleplazaEditClick({ name, addr, is_active,role_id,plaza,plaza_id,id,mobile,email,value:'xs' })}
                        > */}
                        <div className=' flex mt-[-3px] sh-5 w-10 cursor-pointer '>
                          <PencilSquareIcon color='green'
                          onClick={() => handleEditHoExpense({id,date_rep,plaza_code,exp_id,voucher_no,plaza,name,amount,narration,report_id })}
                          />
                          <TrashIcon color="red" onClick={()=>deleteHoExpense(id)} className="h-5 w-10 cursor-pointer" />
                          </div>
                          {/* <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                        <TrashIcon color="red" onClick={()=>deleteHoExpense(id)} className="h-5 ml-[30px] cursor-pointer" />
                        </div> */}
                        </div>
                      </td>
                </tr>
              ))}
            </tbody>
          </table> 
        </Card>
      </div>
        </>:null
        }
        </div>
        </>
     }

     {showform &&

      <>
      <div className='pt-2 w-full '>
    <div className='w-full'>
    <div className="flex justify-center items-center">
     <div className="w-full pt-4  justify-center items-center">
        <div className="rounded-t bg-blue-600 mb-0 py-3">
      <div className="text-center">
        <h6 className="text-white text-xl font-bold">
          H.O Expense Report
          {/* {pname.toUpperCase()} */}
        </h6>
      </div>
    </div>
    </div>
    </div>
    <div className="w-full h-full bg-white">
    <form className=" h-full w-full">
            <div className=" overflow-scroll">
                <div className=" py-4 mx-8  justify-center items-center bg-white">
                <div className="px-4 flex flex-row">
            <div className=" flex mb-5">
              <label className="uppercase text-blueGray-600 text-[17px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
                Date
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring  ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{edithandleDateChange("test", e.target.value)}}
              defaultValue={datetd}
              />
            </div>

            <div className="ml-[50px] flex mb-5">
              <label className="uppercase text-blueGray-600 text-[17px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
              Choose Plaza
              </label>
              <select
            id="option1"
            name="option"
            value={pid}
            onChange={(e) => openingamount(e.target.value)}
            className="w-[200px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Plaza</option>
            {plazas.map((option) => (
              <option  value={option.plaza_id}>
                {option.name}
              </option>
            ))}
          </select>
            </div>

            {/* <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2 text-center"  htmlfor="grid-password">
                Choose Plaza
              </label>
              <select
            id="option1"
            name="option"
            value={pid}
            onChange={(e) => openingamount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Plaza</option>
            {plaza.map((option) => (
              <option  value={option.plaza_id}>
                {option.name}
              </option>
            ))}
          </select>
            </div>
          </div> */}

          </div>
                    <div className="oveflow-scroll h-[500px]">
                    {/* overflow-y-auto */}
                    {/* report part start */}
                        <div className="grid grid-cols-1 ">
                        {/* flex justify-center items-center */}
                            
                            <div className="p-3 border-4 border-gray  w-full ">
                            <div className="w-full left-0 bg-white p-2">
                    
                              <div className="w-full mt-2 justify-center  items-center ">
                              {/* border-2 border-red-400 */}
                            <Card className="h-full w-full max-w-[1480px] ">
                                                            <table className="w-full min-w-max table-auto text-center">
                                                                <thead>
                                                                    <tr>
                                                                        {TABLE_HEAD.map((head) => (
                                                                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 opacity-70  justify-center sm:w-auto text-center  ">
                                                                                <Typography
                                                                                    variant="normal"
                                                                                    color="black"
                                                                                    className="font-bold leading-none text-[15px] flex justify-center items-center p-2"
                                                                                >
                                                                                    {head}
                                                                                </Typography>
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {editrowData.map((row, rowIndex) => (
                                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even:bg-blue-gray-50/50' : ''}>
                                                                            <td className="p-4 border-2 w-[2px]">
                                                                                <Typography variant="small" color="blue-gray" className="font-normal flex justify-center items-center ">
                                                                                    {rowIndex + 1}
                                                                                </Typography>
                                                                            </td>
                                                                            <td className="border-2 p-1 w-[340px]">
                                                                                {/* <input type="number" placeholder="Expense" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" /> */}
                                                                                <select
            id="option"
            name="option"
            onChange={(e) => handleEditRowInputChange(rowIndex,'id',e.target.value)}
            value={row.id}
            className="w-full border border-gray-300 justify-center rounded-md h-[35px] uppercase"
          >
            <option value="" className='font-normal text-[15px] w-[330px]  '>Select Expense</option>
            {options.map((option) => (
              <option  value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
                                                                            </td>
                                                                            <td className="border-2 p-1 w-[120px]">
                                                                                <input type="text" placeholder="Amount" className="border-2 items-center placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150 w-[110px]"
                                                                                 onChange={(e) => handleEditRowInputChange(rowIndex,'amount',e.target.value)}
                                                                                 value={row.amount} />
                                                                            </td>
                                                                            <td className="border-2  w-[5px]">
                                                                                <input type="text" placeholder="Voucher No" className="border-2 justify-center items-center placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150 w-[80px]"
                                                                                onChange={(e) => handleEditRowInputChange(rowIndex,'voucherno',e.target.value)}
                                                                                value={row.voucherno} />
                                                                            </td>
                                                                            <td className="mx-auto pt-1 px-1 border-2 ">
                                                                                {/* <input type="text" placeholder="Narration" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'narration',e.target.value)}
                                                                                value={row.narration}
                                                                                 /> */}
                                                                                 <textarea
        placeholder="Narration" 
        className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full h-full "
        onChange={(e) => handleEditRowInputChange(rowIndex, 'narration', e.target.value)}
        
        value={row.narration}
        rows={1}
        style={{ minHeight: '35px', maxHeight: '500px'  }} 
    />
                                                                            </td>
                                                                            
                                                                        </tr>
                                                                    ))}
                                                                   
                                                                </tbody>
                                                            </table>
                                                        </Card>
                                                        <div className="flex justify-start items-start">
                          <div className="flex  w-full  m-5">
        <div className="left-0 uppercase m-3 flex-initial font-bold pb-[5px] w-[180px]">Total Expense:</div>
        <input type="number" placeholder="TOTAL EXPENSE" className="border-2 mt-2 w-[220px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        // value={(formData.opening_amt)+(formData.adv_from_ho)+(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)-(formData.cash_dep_bank)-(formData.cash_dep_arcpl)-(formData.cash_kpt)}
        value={editformData.cash_kpt}
        disabled  />
      </div>
      <div className="m-5 flex justify-end items-end">
                          <div className="m-2 w-[100px]">
                        <Button color="red" onClick={goback}>Go Back</Button>
                        </div>
                        <div className="m-2 ">
                          <Button color="green" onClick={handlesubmit}>Submit</Button>
                          </div>
                        </div>
     </div>
                                                        </div>
          </div>
                            </div>
                        </div>
                        {/* report part end */}
                        {/* calculation part start */}
                        
                       
                        {/* calculation part ends  */}
                        {/* <div className="m-5 flex justify-start items-start">
                          <Button color="red" onClick={handlesubmit}>Go Back</Button>
                        </div> */}
                       
                    </div>
                </div>
            </div>
        {/* </div> */}
    </form>
    </div>
    {/* form part ends */}
    </div>
    </div>
    {/* </div> */}
    {/* </Card> */}
      
      </>

     }
    </>
  )
}