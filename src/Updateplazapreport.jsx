import React, { useState,useEffect } from "react";
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import {
  TrashIcon
} from "@heroicons/react/24/solid"; 

const TABLE_HEAD = ['Sr.no','Expense','Amount','Voucher No','Narration',''];
// let index = 0;

export default function Updateplazapreport({onCompleteTask,open_,date_rep_,opening_amt_,adv_from_ho_,total_cash_recievable_,balaji_,monthly_pass_amt_,gross_cash_rec_,total_cash_,total_cash_rec_,short_excess_tc_,cash_dep_bank_,cash_dep_arcpl_,cash_kpt_,diff_cash_tp_,total_fast_tag_cl_,short_amt_adj_,excess_amt_adj_,total_fast_tag_rec_,fst_tg_trf_bnk_,diff_reciev_,total_coll_,plaza_code_,salary_,name_,test_,user_id_,entry_id_,on_monthly_pass_amt_}) {
    const [pname,setpname]  = useState('');
    const [rowData, setRowData] = useState([]);
    const [options,setoptions] = useState([]);
    const [datetd,setdatetd] = useState('');
    const [plaza_id,setplaza_id] = useState('');
    const [user_id,set_user_id] = useState('');
    const [rem,setrem] = useState('');
    const [oi,setoi] = useState('');
    const [show,setshow] = useState(open_);
    const handleRowInputChange = (index, fieldName, value) => {
      // console.log(rowData);
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
      date_rep:date_rep_ || '',
      opening_amt:  '',
      adv_from_ho : adv_from_ho_ || "",
      total_cash_recievable :total_cash_recievable_|| "",
      balaji : balaji_ || "",
      monthly_pass_amt : monthly_pass_amt_ || "",
      gross_cash_rec : gross_cash_rec_|| "",
      total_cash : total_cash_ || "",
      total_cash_rec : total_cash_rec_ || "",
      short_excess_tc : short_excess_tc_ || "",
      cash_dep_bank : cash_dep_bank_||"",
      cash_dep_arcpl : cash_dep_arcpl_ || "",
      cash_kpt : cash_kpt_ || "",
      diff_cash_tp : diff_cash_tp_ || "",
      total_fast_tag_cl : total_fast_tag_cl_ || "",
      short_amt_adj : short_amt_adj_ || 0,
      excess_amt_adj : excess_amt_adj_ || 0,
      total_fast_tag_rec : total_fast_tag_rec_ || "",
      fst_tg_trf_bnk : fst_tg_trf_bnk_ || 0,
      diff_reciev : diff_reciev_ || "",
      total_coll : total_coll_ || "",
      plaza_code : plaza_code_ || "",
      user_id : user_id_ || "",
      test: test_ || "",
      name:name_ || "",
      salary:salary_ || "",
      expensetype:[],
      remitance:"",
      id:entry_id_,
      on_monthly_pass_amt:on_monthly_pass_amt_||""
    
  });
   
  const resetForm = () => {
    setFormData({
      date_rep:date_rep_ || '',
      opening_amt: opening_amt_  ||'',
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
      plaza_code : plaza_code_ || "",
      user_id : user_id_ || "",
      test:  "",
      name: "",
      salary:"",
      expensetype:[],
      remitance:"",
      id:entry_id_,
      on_monthly_pass_amt:""
    });
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
  return `${year}-${month}-${day}`;
};

const handleDateChange = (fieldName,value) =>{
  const enteredDate = new Date(value);
  const today = new Date();
  const decrydata = decryptAndRetrieveData("Harry");
  fetch(api+'getoa',{
    method:'POST',
    body: JSON.stringify({ date: value, plaza: plaza_code_  }),
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
    // total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    diff_cash_tp:       (parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(parseFloat(formData.cash_dep_bank)+parseFloat(formData.cash_dep_arcpl)+parseFloat(formData.cash_kpt)),
    total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
    diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
    total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
    short_excess_tc:    (parseFloat(formData.total_cash_rec)-(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt))),
    cash_kpt : totalExpenseAmount,
    expensetype:    rowData,
    plaza_code:plaza_code_,
    user_id : user_id,
    remitance:rem
  };
  // const formDataWithDerived = { ...formData, ...deriveddata };
  // console.log(formDataWithDerived);
  // console.log(totalExpenseAmount);
  // insertplazareport
  if(formData.date_rep === ''){
    alert("Choose Date");
  }else{
    const formDataWithDerived = { ...formData, ...deriveddata };
  const deriveddataWithZeroes = setEmptyFieldsToZero(formDataWithDerived);


// console.log(deriveddataWithZeroes);
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
 const res = await fetch(api+'updpreport',{
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
      resetForm();
      // setalert(true);
      // setshow(false);
      onCompleteTask();
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
};
 
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

  return (
    <>
    {/* <Card> */}
    {/* <div className="px-5"> */}
    {show ?
    <div className='pt-2 w-full '>
    {/* className="h-[800px]" */}
    {/* flex justify-center items-center */}
    <div className='w-full'>
        {/* head part start */}
    <div className="flex justify-center items-center">
     <div className="w-full pt-4  justify-center items-center">
        <div className="rounded-t bg-black mb-0 py-6">
      <div className="text-center">
        <h6 className="text-white text-xl font-bold">
          {/* Plaza Entry */}
          {pname.toUpperCase()}
        </h6>
      </div>
    </div>
    </div>
    </div>
    {/* head part end */}
    {/* form part start */}
    <div className="w-full h-full bg-white">
    {/* className="w-full py-4 mx-8 justify-center items-center bg-white" */}
    {/* className="w-full  bg-white" */}
    <form className=" h-full w-full">
        {/* <div> */}
            <div className=" overflow-scroll">
                <div className=" py-4 mx-8  justify-center items-center bg-white">
                <div className="px-4">
            <div className=" flex mb-5">
              <label className="uppercase text-blueGray-600 text-[20px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
                {/* Choose  */}
                Date
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring  ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{handleDateChange("test", e.target.value)}}
            //   onChange={(e) =>{handleDateChange("test", e.target.value)}}  w-full
            defaultValue={formData.date_rep}
            disabled
              />
            </div>
          </div>
                    <div className="oveflow-scroll h-[500px]">
                    {/* overflow-y-auto */}
                    {/* report part start */}
                        <div className="grid grid-cols-2">
                        {/* flex justify-center items-center */}
                            <div className="border-2 border-black m-4   max-w-[450px]">
                            {/* overflow-scroll */}
                            {/* p-5 */}
          {/* Collection start */}
      <Card className="h-full w-full min-w-[350px]">
      <div className="flex justify-center items-center font-bold text-[25px] mb-[-20px]">Collection Report</div>
      <div className="flex justify-start w-full m-5">
  <div className=" p-4  items-start  flex">
  {/* border-2  border-red-400 ml-[-10px]*/}
    <div className="w-full font-bold m-4">
      <div className="flex justify-center items-center w-full p-1">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Opening Amount:</div>
        <input type="text" placeholder="Opening Amount" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" defaultValue={oi} disabled />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Advance from H.O:</div>
        <input type="text" placeholder="Advance from H.O" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.adv_from_ho}
        onChange={(e) => handleInputChange("adv_from_ho", e.target.value)}
         />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Cash 1</div>
        <input type="text" placeholder="System Cash" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.total_cash_recievable}
        onChange={(e) => handleInputChange("total_cash_recievable", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Cash 2</div>
        <input type="text" placeholder="Cash 2" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.balaji}
        onChange={(e) => handleInputChange("balaji", e.target.value)}  />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">MONTHLY PASS AMOUNT:</div>
        <input type="text" placeholder="MONTHLY PASS AMOUNT" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.monthly_pass_amt}
        onChange={(e) => handleInputChange("monthly_pass_amt", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Online MONTHLY PASS AMOUNT:</div>
        <input type="text" placeholder="MONTHLY PASS AMOUNT" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.on_monthly_pass_amt}
        onChange={(e) => handleInputChange("on_monthly_pass_amt", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">Cash Deposited by TC:</div>
        <input type="text" placeholder="Cash Deposited by TC" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.total_cash_rec}
        onChange={(e) => handleInputChange("total_cash_rec", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">CASH DEPOSITED IN ARCPL:</div>
        <input type="text" placeholder="CASH DEPOSITED IN ARCPL" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.cash_dep_arcpl}
        onChange={(e) => handleInputChange("cash_dep_arcpl", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">CASH DEPOSITED IN bank:</div>
        <input type="text" placeholder="CASH DEPOSITED IN BANK" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.cash_dep_bank}
        onChange={(e) => handleInputChange("cash_dep_bank", e.target.value)} />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase  flex-initial ml-[-30px] pb-[5px] w-[250px]">FAST TAG COLLECTION:</div>
        <input type="text" placeholder="FAST TAG COLLECTION" className="border-2 w-[100px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.total_fast_tag_cl}
        onChange={(e) => handleInputChange("total_fast_tag_cl", e.target.value)} />
      </div>
      {/* <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">EXCESS AMOUNT ADJUSTMENT:</div>
        <input type="number" placeholder="EXCESS AMOUNT ADJUSTMENT" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.excess_amt_adj} 
        onChange={(e) => handleInputChange("excess_amt_adj", e.target.value)}/>
      </div> */}
      {/* <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">short AMOUNT ADJUSTMENT:</div>
        <input type="number" placeholder="SHORT AMOUNT ADJUSTMENT" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.short_amt_adj} 
        onChange={(e) => handleInputChange("short_amt_adj", e.target.value)}/>
      </div> */}
      {/* <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">FAST TAG DEPOSITED IN BANK:</div>
        <input type="number" placeholder="FAST TAG DEPOSITED IN BANK" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" value={formData.fst_tg_trf_bnk}
        onChange={(e) => handleInputChange("fst_tg_trf_bnk", e.target.value)}  />
      </div> */}
    </div>
  </div>
</div>

</Card>
          {/* collection end */}
                            </div>
                            <div className="p-4 border-2 border-black m-4 ml-[-60px]">
                            <div className="w-full left-0">
                            <div className="flex justify-center items-center font-bold text-[25px] mb-[-15px]">Expense Report</div>
                              <div className="w-full m-4 p-4">
                              {/* border-2 border-red-400 */}
                            <Card className="h-full w-full max-w-[800px] overflow-scroll">
                                                            <table className="w-full min-w-max table-auto text-left">
                                                                <thead>
                                                                    <tr>
                                                                        {TABLE_HEAD.map((head) => (
                                                                            <th key={head} className={head === 'Sr.no'?"border-2 border-blue-gray-100 bg-blue-gray-50 p-4":"border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[120px]"}>
                                                                              {/* border-2 border-blue-gray-100 bg-blue-gray-50 p-4 */}
                                                                              {/* w-[120px]  {head === 'Sr no' ? "border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[60px]":"border-2 border-blue-gray-100 bg-blue-gray-50 p-2 w-[120px]"}>*/}
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="blue-gray"
                                                                                    className="font-normal leading-none opacity-70 flex justify-center items-center "
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
                                                                            <td className="p-1 border-2 w-[80px]">
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
              <option  value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
                                                                            </td>
                                                                            <td className="p-1 border-2 ">
                                                                                <input type="number" placeholder="Amount" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                 onChange={(e) => handleRowInputChange(rowIndex,'amount',e.target.value)}
                                                                                 value={row.amount} />
                                                                            </td>
                                                                            <td className="p-1 border-2 ">
                                                                                <input type="text" placeholder="Voucher No" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'voucherno',e.target.value)}
                                                                                value={row.voucherno} />
                                                                            </td>
                                                                            <td className="p-4 border-2 ">
                                                                                {/* <input type="text" placeholder="Narration" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'narration',e.target.value)}
                                                                                value={row.narration} /> */}
                                                                                <textarea
        placeholder="Narration" 
        className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full h-auto resize-horizontal"
        onChange={(e) => handleRowInputChange(rowIndex, 'narration', e.target.value)}
        value={row.narration}
        rows={1}
        style={{ minHeight: '27px' }} 
    />
                                                                            </td>
                                                                            <td className="p-4 border-2 w-[30px]">
                                                                                {/* <Button color="red" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button> */}
                                                                                <TrashIcon color="red" onClick={() =>handleDeleteRow(rowIndex)}
                                                                                className="h-5 ml-[30px] cursor-pointer"/>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    <tr>
                                                                        <td colSpan={5} className="p-4 border-2">
                                                                            <Button color="black" onClick={handleAddRow}>Add Row</Button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </Card>
                                                        </div>
          </div>
                            </div>
                        </div>
                        {/* report part end */}
                        {/* calculation part start */}
                        <div className="border-2 border-black  font-bold p-4">
                          <div className="flex justify-start items-start">
                          <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">Total Cash Received:</div>
        <input type="number" placeholder="TOTAL CASH RECEIVED" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)}
        disabled />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">Total Fast Tag Receivable:</div>
        <input type="number" placeholder="TOTAL FAST TAG RECEIVABLE" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
        disabled />
      </div>
                          </div>
                          <div className="flex justify-start items-start">
                          <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">
          {/* Difference cash in plaza: */}
          Closing Balance
          </div>
        <input type="number" placeholder="CLOSING AMOUNT" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={parseFloat(oi)+parseFloat(formData.adv_from_ho)+parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)-parseFloat(formData.cash_dep_bank)-parseFloat(formData.cash_dep_arcpl)-parseFloat(formData.cash_kpt)}
        disabled  />
      </div>
      <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">total collection:</div>
        <input type="number" placeholder="TOTAL COLLECTION" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
        disabled />
      </div>
                          </div>
                          <div className="flex justify-start items-start">
                          <div className=" flex w-full   p-4">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">Total Expense:</div>
        <input type="number" placeholder="Total expense" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        value={formData.cash_kpt}
        disabled  />
      </div>

      
                          </div>
                        </div>
                        {/* calculation part ends  */}
                        <div className="m-5 flex justify-end items-end">
                          <Button color="green" onClick={handlesubmit}>Submit</Button>
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

