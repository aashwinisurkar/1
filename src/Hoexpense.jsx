import React, { useState,useEffect } from "react";
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import {
  TrashIcon
} from "@heroicons/react/24/solid"; 

const TABLE_HEAD = ['Sr.no','Expense','Amount','Voucher No','Narration',''];
const TABLE_HEAD1 = ["Sr no","Date", "Plaza Name","Expense no","Amount","Narration"];
// let index = 0;

export default function Hoexpense() {
    const [pname,setpname]  = useState('');
    const [rowData, setRowData] = useState([]);
    const [options,setoptions] = useState([]);
    const [datetd,setdatetd] = useState('');
    const [plaza_id,setplaza_id] = useState('');
    const [user_id,set_user_id] = useState('');
    const [rem,setrem] = useState('');
    const [plaza,setplaza] = useState([]);
    const [pid,setpid] = useState(null);
    const [reportid,setreportid] = useState(null);
    const [total_exp,setexp] = useState('');
    const [showform,setshowform] = useState(false);
    const [TABLE_ROWS,setrows] = useState([]);

    const handleRowInputChange = (index, fieldName, value) => {
      // console.log(rowData);
      const updatedRows = [...rowData];
      updatedRows[index][fieldName] = value;
      setRowData(updatedRows);
      const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
      handleInputChange("cash_kpt", totalExpenseAmount);
      // const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
  };

  const handleGetResult = () =>{
    setshowform(true);
  }

  const goback = () =>{
    setshowform(false);
  }

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
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
      remitance:""
    
  });

  const openingamount = async(value) => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    setpid(value);
    const today = new Date();
    const formattedDate = formatDate(today);

    if(formData.test){
      const res = await fetch(api+'getreportid',{
        method: "POST",
        body: JSON.stringify({date: formData.test, plaza: value})
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
    // console.log(updatedRows);
};

const formatDate1 = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const handleDateChange = async(fieldName,value) =>{
  const enteredDate = new Date(value);
  const today = new Date();
// console.log(fieldName);
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
if(pid){
const res = await fetch(api+'getreportid',{
  method: "POST",
  body: JSON.stringify({date: value, plaza: pid})
})
if(res.ok){
  const data = await res.json();
  if(data.ResponseCode === '202'){
    // console.log(data.Data[0].id);
    setreportid(data.Data[0].id);
  }
}
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
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: 0,
    }));
  }
};

const resetForm = () => {
  setFormData({
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
  setshowform(false);
  fetch(api+'hoexpense_report')
      .then((response) => response.json())
      .then((data) => {
        setrows(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

};


const handlesubmit  = async() =>{
  const totalExpenseAmount = rowData.reduce((total, row) => total + parseFloat(row.amount || 0), 0);
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
    date_rep:formData.test,
    gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
    diff_cash_tp:       (parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
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
  const formDataWithDerived = { ...formData, ...deriveddata };
  const deriveddataWithZeroes = setEmptyFieldsToZero(formDataWithDerived);
  console.log(deriveddataWithZeroes);
  if(reportid){
  const res = await fetch(api+'hoexpenserep',{
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
      resetForm();
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

  useEffect(() => {
    const decrydata = decryptAndRetrieveData("Harry");
    const currentDate = new Date().toISOString().split('T')[0];
    let i = 0;
    if(i<2){
      handleDateChange("test", currentDate);
      i++;
    }
    setdatetd(currentDate);
    setplaza_id(decrydata.user.pid);
    set_user_id(decrydata.user.id);

    

fetch(api+'getrem',{
  method:'POST',
  body:JSON.stringify({plaza_code:decrydata.user.pid})
})
.then((response)=> response.json())
.then((data)=>
setrem(data.remitance)
)
.catch((error)=>{
  console.log(error);
},[]);


fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        
        setplaza(data);
       
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

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
        setoptions(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

      fetch(api+'hoexpense_report')
      .then((response) => response.json())
      .then((data) => {
        setrows(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });

  },[]);

  return (
    <>
    {showform?
    <>
    <div className='pt-2 w-full '>
    <div className='w-full'>
    <div className="flex justify-center items-center">
     <div className="w-full pt-4  justify-center items-center">
        <div className="rounded-t bg-black mb-0 py-6">
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
              <label className="uppercase text-blueGray-600 text-[20px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
                Date
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring  ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{handleDateChange("test", e.target.value)}}
              defaultValue={datetd}
              />
            </div>

            <div className="ml-[50px] flex mb-5">
              <label className="uppercase text-blueGray-600 text-[20px] flex justify-start items-center font-bold mb-2 px-2" htmlfor="grid-password">
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
            {plaza.map((option) => (
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
                        <div className="grid grid-cols-1">
                        {/* flex justify-center items-center */}
                            
                            <div className="p-4 m-4 border-2 border-black w-full ">
                            <div className="w-full left-0">
                            <div className="flex justify-center items-center font-bold text-[25px] mb-[-15px]">Expense Report</div>
                              <div className="w-full m-4 p-4">
                              {/* border-2 border-red-400 */}
                            <Card className="h-full w-full max-w-[1500px] overflow-scroll">
                                                            <table className="w-full min-w-max table-auto text-left">
                                                                <thead>
                                                                    <tr>
                                                                        {TABLE_HEAD.map((head) => (
                                                                            <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[50px]">
                                                                                <Typography
                                                                                    variant="small"
                                                                                    color="blue-gray"
                                                                                    className="font-normal leading-none opacity-70 flex justify-center items-center w-[50px]"
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
                                                                            <td className="p-4 border-2 w-[5px]">
                                                                                <Typography variant="small" color="blue-gray" className="font-normal flex justify-center items-center w-[5px]">
                                                                                    {rowIndex + 1}
                                                                                </Typography>
                                                                            </td>
                                                                            <td className="p-4 border-2 w-[80px]">
                                                                                {/* <input type="number" placeholder="Expense" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" /> */}
                                                                                <select
            id="option"
            name="option"
            onChange={(e) => handleRowInputChange(rowIndex,'id',e.target.value)}
            value={row.id}
            className="w-[170px] border border-gray-300 rounded-md p-2 h-[37px] uppercase"
          >
            <option value="" >Select Expense</option>
            {options.map((option) => (
              <option  value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
                                                                            </td>
                                                                            <td className="p-4 border-2 w-[10px]">
                                                                                <input type="number" placeholder="Amount" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150 w-[90px]"
                                                                                 onChange={(e) => handleRowInputChange(rowIndex,'amount',e.target.value)}
                                                                                 value={row.amount} />
                                                                            </td>
                                                                            <td className="p-4 border-2 w-[30px]">
                                                                                <input type="text" placeholder="Voucher No" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150 w-[70px]"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'voucherno',e.target.value)}
                                                                                value={row.voucherno} />
                                                                            </td>
                                                                            <td className="p-4 border-2 w-[30px]">
                                                                                {/* <input type="text" placeholder="Narration" className="border-2  placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150"
                                                                                onChange={(e) => handleRowInputChange(rowIndex,'narration',e.target.value)}
                                                                                value={row.narration}
                                                                                 /> */}
                                                                                 <textarea
        placeholder="Narration" 
        className="border-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-[80px] h-auto"
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
                        <div className="border-2 border-black  font-bold">
                          <div className="flex justify-start items-start">
                          
      
                          </div>
                          <div className="flex justify-start items-start">
                          <div className="flex justify-center items-center w-full  p-2">
        <div className="left-0 uppercase m-3 flex-initial ml-[-30px] pb-[5px] w-[250px]">Total Expense:</div>
        <input type="number" placeholder="TOTAL EXPENSE" className="border-2 w-[250px] placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring h-[27px] ease-linear transition-all duration-150" 
        // value={(formData.opening_amt)+(formData.adv_from_ho)+(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)-(formData.cash_dep_bank)-(formData.cash_dep_arcpl)-(formData.cash_kpt)}
        value={formData.cash_kpt}
        disabled  />
      </div>
      

      
                          </div>
                          
                        </div>
                        {/* calculation part ends  */}
                        {/* <div className="m-5 flex justify-start items-start">
                          <Button color="red" onClick={handlesubmit}>Go Back</Button>
                        </div> */}
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
    {/* </div> */}
    {/* </Card> */}
 </> :
      <>
      <div className="overflow-x-auto w-[100%] mt-20">
        <div className='flex justify-end'>
        <Button className='mx-5 mb-5' color='blue' 
        onClick={handleGetResult}
        >
              Plaza Expense Entry
          </Button>
          </div>
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD1.map((head) => (
                  <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-4 w-[30px] font-bold">
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
              {TABLE_ROWS.map(({ date_rep, plaza,name,amount,narration }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[50px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {fdate(date_rep)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {plaza}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {amount}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {narration}
                    </Typography>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table> 
        </Card>
      </div>
      </>
      }
    </>
  )
}

