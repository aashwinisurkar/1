// import React, { useState,useEffect } from "react";
// import CryptoJS from "crypto-js";
// import api from "./ApiLink.mjs";
// import {
//   Card,
//   Input,
//   Checkbox,
//   Button,
//   Typography,
//   Stepper, 
//   Step,
// } from "@material-tailwind/react";
// import { Alert } from "@material-tailwind/react";

// export default function DefaultStepper() {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [isLastStep, setIsLastStep] = React.useState(false);
//   const [isFirstStep, setIsFirstStep] = React.useState(false);
//   const [id,setid] = useState(null);
//   const [pid,setpid] = useState(null);
//   const [currentDate, setCurrentDate] = useState("");
//   const [isFormVisible, setIsFormVisible] = useState(true);
//   const [alert1,setalert] = useState(true);
//   const [open1, setOpen1] = useState(false);
//   const [pname,setpname]  = useState('');
//   const [formData, setFormData] = useState({
//       date_rep:"",
//       opening_amt: "",
//       adv_from_ho :"",
//       total_cash_recievable : "",
//       balaji : "",
//       monthly_pass_amt : "",
//       gross_cash_rec : "",
//       total_cash : "",
//       total_cash_rec : "",
//       short_excess_tc : "",
//       cash_dep_bank : "",
//       cash_dep_arcpl : "",
//       cash_kpt : "",
//       diff_cash_tp : "",
//       total_fast_tag_cl : "",
//       short_amt_adj : "",
//       excess_amt_adj : "",
//       total_fast_tag_rec : "",
//       fst_tg_trf_bnk : "",
//       diff_reciev : "",
//       total_coll : "",
//       plaza_code : "",
//       user_id : "",
//       test:"",
//       name:""
    
//   });

//   const handleNext = () => {
//     !isLastStep && setActiveStep((cur) => cur + 1)
//   };
//   const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

//   const handleSubmit = async(event) => {
//     event.preventDefault();
//     if(formData.test){
//       const derivedData = {
//         gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//         total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//         total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//         diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
//         total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
//         diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
//         total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
//         user_id: id,
//         plaza_code:pid,
//         date_rep:formData.test
//       };
//       const formDataWithDerived = { ...formData, ...derivedData };
//       console.log("Form submitted!",formDataWithDerived);
//       const res = await fetch(api+'insertreport',{
//         method: "POST",
//               crossDomain: true,
//               headers:{              
//                   "Content-Type":"application/json",
//                   Accept:"application/json",
//                   "Access-Control-Allow-Origin":"*",
                  
//               },
//               body: JSON.stringify(formDataWithDerived)
//       });
//       if(res.ok){
//         const responseData = await res.json();
//         if(responseData.ResponseCode === "200"){
//           alert("Data Inserted Successfully ");
//           setalert(true);
//         }else{
//           if(responseData.ResponseCode === "402"){
//             alert("Entry Done for Today");
//           }else{
//             console.log(responseData);
//             console.log(res);
//           }
//         }
//       }
//     }else{
//     const derivedData = {
//       gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//       total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//       total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
//       diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
//       total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
//       diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
//       total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
//       user_id: id,
//       plaza_code:pid,
//       date_rep:currentDate
//     };
//     const formDataWithDerived = { ...formData, ...derivedData };
//     console.log("Form submitted!",formDataWithDerived);
//     const res = await fetch(api+'insertreport',{
//       method: "POST",
//             crossDomain: true,
//             headers:{              
//                 "Content-Type":"application/json",
//                 Accept:"application/json",
//                 "Access-Control-Allow-Origin":"*",
                
//             },
//             body: JSON.stringify(formDataWithDerived)
//     });
//     if(res.ok){
//       const responseData = await res.json();
//       if(responseData.ResponseCode === "200"){
//         alert("Data Inserted Successfully ");
//         setalert(true);
//       }else{
//         if(responseData.ResponseCode === "402"){
//           alert("Entry Done for Today");
//         }else{
//           console.log(responseData);
//           console.log(res);
//         }
//       }
//     }
    
//   }
// };


//   const decryptAndRetrieveData = (key) => {
//     const encryptedData = localStorage.getItem('encryptedData');
//     if (encryptedData) {
//       const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
//       if (decryptedData) {
//         return JSON.parse(decryptedData);
//       }
//     }
//     return null;
//   };

  

//   const handleInputChange = (fieldName,value) =>{
//     const floatValue = parseFloat(value);

//     if (!isNaN(floatValue) && floatValue >= 0) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [fieldName]: floatValue,
//       }));
//     } else {
//       setFormData((prevData) => ({
//         ...prevData,
//         [fieldName]: 0,
//       }));
//     }
//   };
  
//   const handleDateChange = (fieldName,value) =>{
//       const enteredDate = new Date(value);
//       const today = new Date();

//   if (enteredDate > today) {
//     setFormData((prevData) => ({
//       ...prevData,
//       [fieldName]: formatDate1(value),
//     }));
//   }else{ 
//       setFormData((prevData) => ({
//         ...prevData,
//         [fieldName]: value,
//       }));
//     }
//     };

//     const formatDate1 = (date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     useEffect(() => {
//       const decrydata = decryptAndRetrieveData("Harry");
//       setid(decrydata.user.id);
//       setpid(decrydata.user.pid);
//       const formatDate = (date) => {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         return `${year}-${month}-${day}`;
//       };
  
//       const today = new Date();
//       const formattedDate = formatDate(today);
//       setCurrentDate(formattedDate);
//     fetch(api+'getoa',{
//         method:'POST',
//         body: JSON.stringify({ date: formattedDate,plaza:decrydata.user.pid }),
//     })
//     .then((response) => response.json())
//     .then((data) => 
//     handleInputChange("opening_amt", data.oa)
//     )
//     .catch((error) =>{
//         console.log(error);
//     },[]);

    

//   fetch(api+'getplazastat',{
//     method:'POST',
//     body: JSON.stringify({'plaza':decrydata.user.pid})
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       setpname(data.data.plaza)
//     })




//     },[setid,setpid]);

//   const renderFormPart = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <>
//           <div className="w-full mt-5 flex flex-col justify-center">
//             <div className="text-[20px] text-center"> Choose Date </div> 
//             <div className="items-center justify-center flex ">        
//           <div  class="relative max-w-sm">
//           <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
//           <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
//           </svg>
//           </div>
//           <input  type="date" className="bg-gray-50  border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
//           onChange={(e) =>{handleDateChange("test", e.target.value)}}/>
//           </div>
//           </div>
//           </div>
//           <div className="flex flex-row justify-start">
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Opening Amount</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Opening Amount'
//                     value={formData.opening_amt}
//                     onChange={(e) => handleInputChange("opening_amt", e.target.value)}
//                     disabled
//                     />
//                   </div>
//                   </div>
//                   {/* oa end  */}
//           <div className="w-full">
//           <div className=" mt-5 flex">
//             <div className="justify-start flex-row">
//            <div className="ml-4 mb-8 mx-5 px-5 ">
//                     <label className='mb-3 text-[20px]'>Advance from H.O</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number" 
//                      placeholder='Advance from H.O'
//                      value={formData.adv_from_ho}
//                      onChange={(e) => handleInputChange("adv_from_ho", e.target.value)}
//                     />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Total Cash Recievable</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number" 
//                      placeholder='Total Cash Recievable' 
//                      value={formData.total_cash_recievable}
                     
//                      onChange={(e) => handleInputChange("total_cash_recievable", e.target.value)} />
//                   </div>
//                   </div>
//                   <div className="justify-end ">
//                   <div className="ml-4 mb-8 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Balaji</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Amount from Balaji ' 
//                     value={formData.balaji}
//                     onChange={(e) => handleInputChange("balaji", e.target.value)}
//                     />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Monthly Pass Amount</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Monthly Pass Amount'
//                     value={formData.monthly_pass_amt}
//                     onChange={(e) => handleInputChange("monthly_pass_amt", e.target.value)}
//                     />
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//                   </>
//         );
//       case 1:
//         return (
//           <>
//           <div className="w-full">
//           <div className=" mt-5 flex">
//             <div className="justify-start flex-row">
//            <div className="ml-4 mb-8 mx-5 px-5 ">
//                     <label className='mb-3 text-[20px]'>Short/Excess Collection</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number" 
//                      placeholder='Short/Excess Collection from TC' 
//                      value={formData.short_excess_tc}
//                      onChange={(e) => handleInputChange("short_excess_tc", e.target.value)}
//                      />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Cash Deposited in Bank</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Cash Deposited in Bank'
//                     value={formData.cash_dep_bank}
//                     onChange={(e) => handleInputChange("cash_dep_bank", e.target.value)} />
//                   </div>
//                   </div>
//                   <div className="justify-end ">
//                   <div className="ml-4 mb-8 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Cash Deposited in ARCPL</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Cash Deposited in ARCPL Office'
//                     value={formData.cash_dep_arcpl}
//                     onChange={(e) => handleInputChange("cash_dep_arcpl", e.target.value)} />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Expense</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='CASH KEPT FOR EXPENSES'
//                     value={formData.cash_kpt}
//                     onChange={(e) => handleInputChange("cash_kpt", e.target.value)} />
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//           </>
//         );
//       case 2:
//         return (
//           <>
//           <div className="w-full">
//           <div className=" mt-5 flex">
//             <div className="justify-start flex-row">
//            <div className="ml-4 mb-8 mx-5 px-5 ">
//                     <label className='mb-3 text-[20px]'>Fast Tag Collection</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Total Fast Tag Collection'
//                     value={formData.total_fast_tag_cl}
//                     onChange={(e) => handleInputChange("total_fast_tag_cl", e.target.value)} />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Short Amount Adjustment</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Short Amount Adjustment'
//                     value={formData.short_amt_adj}
//                     onChange={(e) => handleInputChange("short_amt_adj", e.target.value)} />
//                   </div>
//                   </div>
//                   <div className="justify-end ">
//                   <div className="ml-4 mb-8 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Excess Amount Adjustment</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Excess Amount Adjustment '
//                     value={formData.excess_amt_adj}
//                     onChange={(e) => handleInputChange("excess_amt_adj", e.target.value)} />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Fast Tag Deposited in Bank</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px]" type="number"  
//                     placeholder='Fast Tag Deposited in Bank' 
//                     value={formData.fst_tg_trf_bnk}
//                     onChange={(e) => handleInputChange("fst_tg_trf_bnk", e.target.value)}
//                      />
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//           {/*  */}
//           </>
//         );

//       case 3:
//         return(
//           <>
//           <div className="w-full">
//           <div className=" mt-5 flex">
//             <div className="justify-start flex-row">
//            <div className="ml-4 mb-8 mx-5 px-5 ">
//                     <label className='mb-3 text-[20px]'>Total Cash Received</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px] cursor-not-allowed" type="number"  
//                     placeholder='Total Fast Tag Collection'
//                     value={(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)}
//                     disabled
//                      />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Difference cash in Toll Plaza</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px] cursor-not-allowed" type="number"  
//                     placeholder='Short Amount Adjustment'
//                     value={(formData.opening_amt)+(formData.adv_from_ho)+(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)-(formData.cash_dep_bank)-(formData.cash_dep_arcpl)-(formData.cash_kpt)}
//                     disabled
//                     />
//                   </div>
//                   </div>
//                   <div className="justify-end ">
//                   <div className="ml-4 mb-8 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Total Fast Tag Receivable</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px] cursor-not-allowed" type="number"  
//                     placeholder='Excess Amount Adjustment '
//                     value={(formData.total_fast_tag_cl)+(formData.short_amt_adj)-(formData.excess_amt_adj)}
//                     disabled
//                      />
//                   </div>
//                   <div className="ml-4 mb-2 mx-5 px-5">
//                     <label className='mb-3 text-[20px]'>Total Collection</label>
//                     <br></br>
//                     <input className="border-solid border-cyan-500 border-2 rounded-[5px] w-[280px] h-[40px] cursor-not-allowed" type="number"  
//                     placeholder='Fast Tag Deposited in Bank' 
//                     value={(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)+(formData.total_fast_tag_cl)+(formData.short_amt_adj)-(formData.excess_amt_adj)}
//                     disabled
//                      />
//                   </div>
//                   </div>
//                   </div>
//                   </div>
//           </>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//     { alert1 ? (
//             <div className='fixed bottom-0 right-0 p-4 w-[250px]'>
//             <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
//                 Entry Done
//               </Alert>
//               </div>
//           ): null }
//     <div className="flex flex-col items-center justify-center mt-5 ">
//     <div className="w-[750px]  py-4 px-8 border-2 border-black">
//       <div className="text-[40px] bg-blue-gray-50 text-center border-2 border-black mb-2">{pname}</div>
     
//       <form onSubmit={handleSubmit} >
//         <div className="flex flex-col items-center">
      
//         <Stepper
//           activeStep={activeStep}
//           isLastStep={(value) => setIsLastStep(value)}
//           isFirstStep={(value) => setIsFirstStep(value)}
//         >
//           <Step onClick={() => setActiveStep(0)}>1</Step>
//           <Step onClick={() => setActiveStep(1)}>2</Step>
//           <Step onClick={() => setActiveStep(2)}>3</Step>
//           <Step onClick={() => setActiveStep(3)}>4</Step>
//         </Stepper>
        
//         {renderFormPart(activeStep)}
      
//         </div>
//         <div className="mt-16 flex justify-between">
//           <Button onClick={handlePrev} disabled={isFirstStep}>
//             Prev
//           </Button>
        
//           <Button type={isLastStep ? "Submit" : ""}  onClick={handleNext}>
//               {isLastStep ? "Submit" : "Next"}
//             </Button>
//         </div>
//       </form>
      
//     </div>
//     </div>
//     </>
//   );
// }


import React, { useState,useEffect } from "react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import { Stepper, Step, Button } from "@material-tailwind/react";
 
export default function Reportplaza2() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [id,setid] = useState(null);
  const [pid,setpid] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [alert1,setalert] = useState(true);
  const [open1, setOpen1] = useState(false);
  const [pname,setpname]  = useState('');
  const [formData, setFormData] = useState({
      date_rep:"",
      opening_amt: "",
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
      short_amt_adj : "",
      excess_amt_adj : "",
      total_fast_tag_rec : "",
      fst_tg_trf_bnk : "",
      diff_reciev : "",
      total_coll : "",
      plaza_code : "",
      user_id : "",
      test:"",
      name:"",
      salary:""
    
  });
 
  const formatDate1 = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  const handleDateChange = (fieldName,value) =>{
    const enteredDate = new Date(value);
    const today = new Date();

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




      useEffect(() => {
      const decrydata = decryptAndRetrieveData("Harry");
      setid(decrydata.user.id);
      setpid(decrydata.user.pid);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
  
      const today = new Date();
      const formattedDate = formatDate(today);
      setCurrentDate(formattedDate);
    fetch(api+'getoa',{
        method:'POST',
        body: JSON.stringify({ date: formattedDate,plaza:decrydata.user.pid }),
    })
    .then((response) => response.json())
    .then((data) => 
    handleInputChange("opening_amt", data.oa)
    )
    .catch((error) =>{
        console.log(error);
    },[]);

    

  fetch(api+'getplazastat',{
    method:'POST',
    body: JSON.stringify({'plaza':decrydata.user.pid})
  })
    .then((response) => response.json())
    .then((data) => {
      setpname(data.data.plaza)
    })




    },[setid,setpid]);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

//  submit start
  const handleSubmit = async(event) => {
    event.preventDefault();
    if(formData.test){
      const derivedData = {
        gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
        total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
        total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
        diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
        total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
        diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
        total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
        user_id: id,
        plaza_code:pid,
        date_rep:formData.test
      };
      const formDataWithDerived = { ...formData, ...derivedData };
      console.log("Form submitted!",formDataWithDerived);
      const res = await fetch(api+'insertreport',{
        method: "POST",
              crossDomain: true,
              headers:{              
                  "Content-Type":"application/json",
                  Accept:"application/json",
                  "Access-Control-Allow-Origin":"*",
                  
              },
              body: JSON.stringify(formDataWithDerived)
      });
      if(res.ok){
        const responseData = await res.json();
        if(responseData.ResponseCode === "200"){
          alert("Data Inserted Successfully ");
          setalert(true);
        }else{
          if(responseData.ResponseCode === "402"){
            alert("Entry Done for Today");
          }else{
            console.log(responseData);
            console.log(res);
          }
        }
      }
    }else{
    const derivedData = {
      gross_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
      total_cash_rec:     parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
      total_cash:         parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt),
      diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(formData.cash_dep_bank+formData.cash_dep_arcpl+formData.cash_kpt),
      total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
      diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
      total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
      user_id: id,
      plaza_code:pid,
      date_rep:currentDate
    };
    const formDataWithDerived = { ...formData, ...derivedData };
    console.log("Form submitted!",formDataWithDerived);
    const res = await fetch(api+'insertreport',{
      method: "POST",
            crossDomain: true,
            headers:{              
                "Content-Type":"application/json",
                Accept:"application/json",
                "Access-Control-Allow-Origin":"*",
                
            },
            body: JSON.stringify(formDataWithDerived)
    });
    if(res.ok){
      const responseData = await res.json();
      if(responseData.ResponseCode === "200"){
        alert("Data Inserted Successfully ");
        setalert(true);
      }else{
        if(responseData.ResponseCode === "402"){
          alert("Entry Done for Today");
        }else{
          console.log(responseData);
          console.log(res);
        }
      }
    }
    
  }
};
//  submit end 

  const renderFormPart = (step) => {
    switch (step) {
      case 0:
        return (
          <>
          {/* Date */}
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Choose Date
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder=""
              onChange={(e) =>{handleDateChange("test", e.target.value)}}  />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Opening Amount
              </label>
              <input type="number" placeholder="Opening Amount" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value={formData.opening_amt}
                onChange={(e) => handleInputChange("opening_amt", e.target.value)}
                disabled
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Advance from H.O
              </label>
              <input type="number" placeholder="Advance from H.O"  className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
               onChange={(e) => handleInputChange("adv_from_ho", e.target.value)}
               value={formData.adv_from_ho}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Balaji
              </label>
              <input type="number" placeholder="Balaji" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.balaji}
              onChange={(e) => handleInputChange("balaji", e.target.value)}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Cash Recievable
              </label>
              <input type="number" placeholder="Total Cash Recievable" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.total_cash_recievable}
              onChange={(e) => handleInputChange("total_cash_recievable", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Monthly Pass Amount
              </label>
              <input type="number" placeholder="Monthly Pass Amount" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
              value={formData.monthly_pass_amt}
              onChange={(e) => handleInputChange("monthly_pass_amt", e.target.value)} />
            </div>
          </div>
        </div>
          {/* Date end */}
          
                  </>
        );
      case 1:
        return (
          <>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Short Excess Collection
              </label>
              <input type="number" placeholder="Short Excess Collection" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.short_excess_tc}
              onChange={(e) => handleInputChange("short_excess_tc", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Cash Deposited in ARCPL
              </label>
              <input type="number" placeholder="Cash Deposited in ARCPL" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.cash_dep_arcpl}
              onChange={(e) => handleInputChange("cash_dep_arcpl", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Cash Deposited in Bank
              </label>
              <input type="number" placeholder="Cash Deposited in Bank" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.cash_dep_bank}
              onChange={(e) => handleInputChange("cash_dep_bank", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Expense
              </label>
              <input type="number"  placeholder="Expense" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
              value={formData.cash_kpt}
              onChange={(e) => handleInputChange("cash_kpt", e.target.value)} />
            </div>
          </div>
        </div>
        {/* last bond */}
        <div className="flex justify-center items-center">
        <div className="w-full lg:w-6/12 px-4 mt-4">
            <div className="relative w-full">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2 text-center" htmlfor="grid-password">
                Salary
              </label>
              <input type="number" placeholder="Salary" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
              value={formData.salary}
              onChange={(e) => handleInputChange("salary",e.target.value)}/>
            </div>
          </div>
          </div>
          </>
        );
      case 2:
        return (
          <>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Fast Tag Collection
              </label>
              <input type="number" placeholder="Fast Tag Collection" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.total_fast_tag_cl}
              onChange={(e) => handleInputChange("total_fast_tag_cl", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Excess Amount Adjustment
              </label>
              <input type="number" placeholder="Excess Amount Adjustment" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.excess_amt_adj}
              onChange={(e) => handleInputChange("excess_amt_adj", e.target.value)} />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Short Amount Adjustment
              </label>
              <input type="number" placeholder="Short Amount Adjustment" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.short_amt_adj}
              onChange={(e) => handleInputChange("short_amt_adj", e.target.value)}/>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Fast Tag Deposited in Bank
              </label>
              <input type="number" placeholder="Fast Tag Deposited in Bank" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={formData.fst_tg_trf_bnk}
              onChange={(e) => handleInputChange("fst_tg_trf_bnk", e.target.value)} />
            </div>
          </div>
        </div>
          </>
        );

        case 3:
        return (
          <>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Cash Recieved
              </label>
              <input type="number" placeholder="Total Cash Recieved" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)}
               disabled />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Fast Tag Receivable
              </label>
              <input type="number" placeholder="Total Fast Tag Receivable" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={(formData.total_fast_tag_cl)+(formData.short_amt_adj)-(formData.excess_amt_adj)}
               disabled />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Difference Cash in Toll Plaza
              </label>
              <input type="number"  placeholder="Difference Cash in Toll Plaza" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={(formData.opening_amt)+(formData.adv_from_ho)+(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)-(formData.cash_dep_bank)-(formData.cash_dep_arcpl)-(formData.cash_kpt)}
               disabled />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Collection
              </label>
              <input type="number" placeholder="Total Collection" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={(formData.total_cash_recievable)+(formData.balaji)+(formData.monthly_pass_amt)+(formData.total_fast_tag_cl)+(formData.short_amt_adj)-(formData.excess_amt_adj)}
               disabled />
            </div>
          </div>
        </div>
          </>
        );

      default:
        return null;
    }
  };
 
  return (
   <>
   <div className=" flex pt-2 pb-2 justify-center items-center w-full">
    <div className="w-full ">
   <div className="flex justify-center items-center">
     <div className="w-full pt-4 px-8 justify-center items-center">
        <div className="rounded-t bg-black mb-0 px-6 py-6">
      <div className="text-center flex justify-center items-center">
        <h6 className="text-white text-xl font-bold">
          {/* Plaza Entry */}
          {pname}
        </h6>
      </div>
    </div>
    </div>
    </div>
    <form onSubmit={handleSubmit} >
    <div className="">
     <div className="flex justify-center items-center">
    <div className="w-full py-4 mx-8 justify-center items-center bg-white">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        className="px-4 cursor-pointer"
        color="green"
      >
        <Step onClick={() => setActiveStep(0)}>1</Step>
        <Step onClick={() => setActiveStep(1)}>2</Step>
        <Step onClick={() => setActiveStep(2)}>3</Step>
        <Step onClick={() => setActiveStep(3)}>4</Step>
      </Stepper>
      <div className="pt-6">
      {renderFormPart(activeStep)}
      </div>
      <div className="mt-16 flex justify-between px-4">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button type={isLastStep ? "Submit" : ""} onClick={handleNext}>
              {isLastStep ? "Submit" : "Next"}
            </Button>
      </div>
    </div>
    </div>
    </div>
    </form>
    </div>
    </div>
    </>
  );
}