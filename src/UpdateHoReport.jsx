import React, { useState,useEffect } from "react";
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
// import {
//   TrashIcon

// } from "@heroicons/react/24/solid"; 

const TABLE_HEAD = ['Sr.no','Expense','Amount','Voucher No','Narration'];
// let index = 0;

export default function UpdateHoReport({onCompleteTask,open_,cash_kpt_ ,date_rep_,plaza_code_, entry_id_, voucher_no_, amount_, exp_id_,narration_}) {
    const [pname,setpname]  = useState('');
   
    const [plazas, setPlazas] = useState([]);
    const [options,setoptions] = useState([]);
    const [datetd, setdatetd] = useState('');
    const [plaza_id,setplaza_id] = useState('');
    const [user_id,set_user_id] = useState('');
    const [rem,setrem] = useState('');
    const [oi,setoi] = useState('');
    const [pid,setpid] = useState(null);
    const [show,setshow] = useState(open_);
    const [rowData, setRowData] = useState([{'id':exp_id_,'amount':amount_,'VoucherNo':voucher_no_,'narration':narration_}]);
    const [editRowIndex, setEditRowIndex] = useState(-1);


   
    const handleRowInputChange = (rowIndex, fieldName, value) => {
      console.log(rowData);
      const updatedRows = [...rowData];
      //updatedRows[index][fieldName] = value;
      updatedRows[0]['expense'] =exp_id_;
      updatedRows[0]['amount'] = amount_;
      updatedRows[0]['VoucherNo'] =voucher_no_;
      updatedRows[0]['narration'] = narration_;

      
      
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
    // const handleAddRow = () => {
    //   const newRow = {
    //     id: '',
    //     amount: date.amount,
    //     voucherno: '',
    //     narration: ''
    //   };
    //   setRowData([...rowData, newRow]);
    //   // console.log(rowData);
    // };
    const [formData, setFormData] = useState({
      date_rep:date_rep_ || '',
      plaza_code : plaza_code_ || "",
      cash_kpt : cash_kpt_ || "",
      id:entry_id_,
      voucher_no :voucher_no_ || "",
       amount : amount_ ||"", 
       exp_id : exp_id_ ||"",
       narration : narration_ ||"",
      
    
  });
   
  const resetForm = () => {
    setFormData({
      from:currentDate,
      to:currentDate,
      plaza_code: null,
    });
    setshowTable(false);
    // setshowlist()
  }
// =======================

const handlePlazaChange = (value) => {
  setFormData((prevData) => ({
      ...prevData,
      plaza_code: value,
  }));
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

  const goback=() =>{
    setRowData(updatedRows); 
    console.log(rowData, 'rows')
    setshowform(false);
    setshowlist(true);
  

  }
  const handleDeleteRow = (index) => {
    // console.log(index);
    // console.log(rowData);
  const updatedRows = [...rowData];
    updatedRows.splice(index, 1);
    setRowData(updatedRows);
    const totalExpenseAmount = updatedRows.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
      handleInputChange("cash_kpt", totalExpenseAmount);
    // setRowData(updatedRows);
    // console.log(updatedRows);
};

const formatDate1 = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return '${year}-${month}-${day}';
};

const handleDateChange = (fieldName,value) =>{
  const enteredDate = new Date(value);
  const today = new Date();
  // const decrydata = decryptAndRetrieveData("Harry");

  // fetch(api+'getoa',{
  //   method:'POST',
  //   body: JSON.stringify({ date: formData.test, plaza:value  }),
  // })
  // .then((response) => response.json())
  // .then((data) => 
  // handleInputChange("opening_amt", data.oa)
  // // console.log(data)
  // )
  // .catch((error) =>{
  //   console.log(error);
  // },[]);
  const handleRowInputChange = (rowIndex, fieldName, value) => {
    const updatedRows = [...rowData];
    updatedRows[rowIndex][fieldName] = value;
    setRowData(updatedRows);
    const totalExpenseAmount = updatedRows.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
    handleInputChange("cash_kpt", totalExpenseAmount);
};










  fetch(api+'getoa',{
    method:'POST',
    // body: JSON.stringify({date: formData.test, plaza: value  }),
    body: JSON.stringify({ date: value, plaza: plaza_code_  }),
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
  [fieldName]: formatDate1(today),
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

const handlesubmit  = async() =>{
  const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
  // console.log(totalExpenseAmount);
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
    gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
     total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    diff_cash_tp:       (parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(parseFloat(formData.cash_dep_bank)+parseFloat(formData.cash_dep_arcpl)+parseFloat(formData.cash_kpt)),
    total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
    diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
    total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
    short_excess_tc:    (parseFloat(formData.total_cash_rec)-(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt))),
    cash_kpt : totalExpenseAmount,
    expensetype:    rowData,
    plaza_code:pid,
    user_id : user_id,
    remitance:rem,
    rid:reportid 
  };
  // const formDataWithDerived = { ...formData, ...deriveddata };
  // console.log(formDataWithDerived);
  // console.log(totalExpenseAmount);
  // insertplazareport
 
    const formDataWithDerived = { ...formData, ...deriveddata };
  const deriveddataWithZeroes = setEmptyFieldsToZero(formDataWithDerived);
console.log(deriveddataWithZeroes);


// if(!checkAllIdsPresent(rowData)){
//   alert("Enter All Expenses");
//   return;
// }
// // console.log("hi",rowData);
// if(!checkAllnarrationPresent(rowData)){
//   alert("Enter All narration");
//   return;
// }
// if(!checkAllvoucherPresent(rowData)){
//   alert("Enter Voucher Number Details");
//   return;
// }
if (report_id){
 const res = await fetch(api+'uphoreport',{
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
    
      setRowData([]);
      // setalert(true);
      // setshow(false);
      // onCompleteTask();
    }else{
      if(responseData.ResponseCode === "402"){
        alert("Failed to insert data");
        resetForm();
      }else{
        // console.log(responseData);
        // console.log(res);
        alert("Failed to insert datao");
        resetForm();
      }
    }
  }
}
else{
  alert("Please Select valid Date");
}
}
const openingamount = async(value) => {
  console.log(value,'call');
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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


useEffect(() => {
  
  const decrydata = decryptAndRetrieveData("Harry");
  // console.log(decrydata);
  const currentDate = new Date().toISOString().split('T')[0];
  // console.log(currentDate);
  setdatetd(currentDate);
  setplaza_id(decrydata.user.pid);
  set_user_id(decrydata.user.id);

  
fetch(api+'generate_report_det',{
  method:'POST',
  body:JSON.stringify({report_id:entry_id_})
}).then((response)=>response.json())
.then((data)=> 
// console.log(data.data)
setRowData(data.data)
)
.catch((error)=>{
  console.log(error);
},[]);

let i = 0;
if(i<2){
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: date_rep_, plaza: plaza_code_  }),
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
    body: JSON.stringify({ date: date_rep_, plaza: plaza_code_  }),
  })
  .then((response) => response.json())
  .then((data) => 
  setoi(data.oi)
  // console.log(data)
  )
  .catch((error) =>{
    console.log(error);
  },[]);
  i++
}



fetch(api+'getrem',{
method:'POST',
body:JSON.stringify({plaza_code:plaza_code_,date_rep:date_rep_})
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
      body: JSON.stringify({'plaza':plaza_code_})
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
},[]);


useEffect(() => {

  fetch(api+'get_plaza')
    .then((response) => response.json())
    .then((data) => {
      setPlazas(data);
    })
    .catch((error) => {
      console.error('Error fetching options:', error);
    },[]);
},[setPlazas]);


  return (
    <>
    {/* <Card> */}
    {/* <div className="px-5"> */}
    {show ?
    <div className='pt-2 w-full min-w-[1100px] '>
    {/* className="h-[800px]" */}
    {/* flex justify-center items-center */}
    <div className='w-full'>
        {/* head part start */}
    <div className="flex justify-center items-center">
     <div className="w-full pt-2  bg-blue-600 justify-center items-center">
        <div className="rounded-t   mb-0 py-3">
      <div className="text-center">
        <h5 className="text-white text-xl font-bold">
          {/* Plaza Entry */}
           HO-Expense Report
          {/* {pname.toUpperCase()} */}
        </h5>
      </div>
    </div>
    </div>
    </div>
    {/* head part end */}
    {/* form part start */}
    <div className="w-full h-full bg-white">
 
    <form className=" h-full w-full">
        {/* <div> */}
            <div className=" overflow-scroll">
                <div className=" py-4 mx-8  justify-center items-center bg-white">
                <div className="px-4 flex-row justify-center flex ">
            <div className=" flex mb-4">
              <label className="uppercase text-blueGray-600 text-[20px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
                {/* Choose  */}
                Date
              </label>

              <input type="date" className="border-2 px-3 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring  ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{handleDateChange("test", e.target.value)}}
            //   onChange={(e) =>{handleDateChange("test", e.target.value)}}  w-full
            defaultValue={formData.date_rep}
            disabled
              />
            </div>

            <div className="  ml-[40px] flex mb-2 ">
              <label className="uppercase  lg:ml-0 text-blueGray-600 text-[17px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
              Choose Plaza :-
              </label>
              <select label="Choose Plaza"

          onChange={(e) => handlePlazaChange(e.target.value)}
          value={formData.plaza_code === null ? '' : formData.plaza_code}
          className="w-[250px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Plaza</option>
            {plazas.map((plaza) => (
              <option  value={plaza.plaza_id}>
                {plaza.name}
            </option>
          ))}
          </select>
            </div>
          </div>


                    <div className="oveflow-scroll h-[500px]">
                    {/* overflow-y-auto */}
                    {/* report part start */}
                        <div className="grid grid-cols-1">
                        {/* flex justify-center items-center */}
                            
                            <div className="p-4 border-2 border-black m-4 w-full">
                            <div className="w-full left-0">
                            <div className="flex justify-center items-center font-bold text-[25px] mb-[-15px]">Expense Report</div>
                              <div className="w-full m-4 p-4">
                              {/* border-2 border-red-400 */}
                            <Card className="h-full w-full max-w-[1800px] overflow-scroll">
                                                            <table className="w-full min-w-max table-auto text-left">
                                                                <thead>
                                                                    <tr>
                                                                        {TABLE_HEAD.map((head) => (
                                                                            <th key={head} className={head === 'Sr.no'?"border-2 border-blue-gray-100 bg-blue-gray-50 py-3 ":"border-2 border-blue-gray-100 bg-blue-gray-50  py-3"}>
                                                                              {/* border-2 border-blue-gray-100 bg-blue-gray-50 p-4 */}
                                                                              {/* w-[120px]  {head === 'Sr no' ? "border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[60px]":"border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[120px]"}>*/}
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="blue-gray"
                                                                                    className="font-normal leading-none  ml-5 justify-center items-center "
                                                                                >
                                                                                  {/* w-[80px] */}
                                                                                    {head}
                                                                                </Typography>
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rowData.map((row, rowIndex) => (
                                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'even:bg-blue-gray-50/50' : ''}>
                                                                            <td className="p-1 border-2">
                                                                                <Typography variant="small" color="blue-gray" className="font-normal flex justify-center items-center">
                                                                                    {rowIndex + 1}
                                                                                </Typography>
                                                                            </td>
                                                                            <td className="p-1 border-2 w-[180px]">
                                                                                {/* <input type="number" placeholder="Expense" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" /> */}
                                                                                <select
            id="option"
            name="option"
            onChange={(e) => handleRowInputChange(rowIndex,'id',e.target.value)}
            value={row.id}
            className="w-full border border-gray-300 rounded-md p-2 h-[37px] uppercase"
          >
            <option value="" >Select Expense</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
                                                                            </td>
                                                                            <td className="p-1 border-2m w-[150px] ">
                                                                                <input type="text" placeholder="Amount" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                 onChange={(e) => handleRowInputChange(rowIndex,'amount',e.target.value)}
                                                                                 value={row.amount} />
                                                                            </td>
                                                                            <td className="p-1 border-2 w-[80px]">
                                                                                <input type="text" placeholder="Voucher No" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear w-[80px] transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'voucherno',e.target.value)}
                                                                                value={row.voucherno} />
                                                                            </td>
                                                                            <td className="p-4 border-2 ">
                                                                                {/* <input type="text" placeholder="Narration" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'narration',e.target.value)}
                                                                                value={row.narration} /> */}
                                                                                <textarea
        placeholder="Narration" 
        className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full py-2 h-auto resize-horizontal"
        onChange={(e) => handleRowInputChange(rowIndex, 'narration', e.target.value)}
        value={row.narration}
        rows={1}
        style={{ minHeight: '27px' }} 
    />
                                                                            </td>
                                                                            {/* <td className="p-4 border-2 w-[30px]">
                                                                              
                                                                                <TrashIcon color="red" onClick={() =>handleDeleteRow(rowIndex)}
                                                                                className="h-5 ml-[30px] cursor-pointer"/>
                                                                            </td> */}
                                                                        </tr>
                                                                    ))}
                                                                    {/* <tr>
                                                                        <td colSpan={5} className="p-4 border-2">
                                                                            <Button color="black" onClick={handleAddRow}>Add Row</Button>
                                                                        </td>
                                                                    </tr> */}
                                                                </tbody>
                                                            </table>
                                                        </Card>
                                                        </div>
          </div>
                            </div>
                        </div>
                       
                        <div className="border-2 border-black  font-bold p-4">
                         
                          
                          <div className="flex justify-start items-start">
                          <div className=" flex w-full   p-4">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">Total Expense:</div>
        <input type="number" placeholder="Total expense" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={amount_}
        disabled  />
      </div>

      
                          </div>
                        </div>
                       
                 
                        <div className="m-5 flex justify-end items-end">
                        <div className="m-2">
                        <Button color="red" onClick={goback}>Go Back</Button>
                        </div>
                        <div className="m-2">
                          <Button color="green" onClick={handlesubmit}>Submit</Button>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        {/* </div> */}
    </form>
    </div>
    {/* form part ends */}
    </div>
    </div>
   :<div></div>}
    </>
  )
}