


import React, { useState,useEffect } from "react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import { Stepper, Step, Button } from "@material-tailwind/react";
 
export default function UpdatePlazareport({date_rep_,opening_amt_,adv_from_ho_,total_cash_recievable_,balaji_,monthly_pass_amt_,gross_cash_rec_,total_cash_,total_cash_rec_,short_excess_tc_,cash_dep_bank_,cash_dep_arcpl_,cash_kpt_,diff_cash_tp_,total_fast_tag_cl_,short_amt_adj_,excess_amt_adj_,total_fast_tag_rec_,fst_tg_trf_bnk_,diff_reciev_,total_coll_,plaza_code_,salary_,name_,test_,user_id_,entry_id_}) {
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
      date_rep:date_rep_ || "",
      opening_amt: opening_amt_ || "",
      adv_from_ho : adv_from_ho_ || "",
      total_cash_recievable :total_cash_recievable_ || "",
      balaji : balaji_|| "",
      monthly_pass_amt : monthly_pass_amt_ || "",
      gross_cash_rec : gross_cash_rec_ || "",
      total_cash : total_cash_ ||"",
      total_cash_rec : total_cash_rec_ || "",
      short_excess_tc : short_excess_tc_ ||"",
      cash_dep_bank : cash_dep_bank_ ||"",
      cash_dep_arcpl : cash_dep_arcpl_ || "",
      cash_kpt : cash_kpt_ ||"",
      diff_cash_tp : diff_cash_tp_ || "",
      total_fast_tag_cl : total_fast_tag_cl_ || "",
      short_amt_adj : short_amt_adj_ || "",
      excess_amt_adj : excess_amt_adj_ || "",
      total_fast_tag_rec : total_fast_tag_rec_ || "",
      fst_tg_trf_bnk : fst_tg_trf_bnk_ || "",
      diff_reciev : diff_reciev_ || "",
      total_coll : total_coll_ ||"",
      plaza_code : plaza_code_ || "",
      user_id : user_id_,
      test:"",
      name:"",
      salary: salary_ || "",
      id:entry_id_
    
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

      // console.log(date_rep_);
      const today = new Date();
      const formattedDate = formatDate(today);
      setCurrentDate(formattedDate);

    // fetch(api+'getoa',{
    //     method:'POST',
    //     body: JSON.stringify({ date: formattedDate,plaza:decrydata.user.pid }),
    // })
    // .then((response) => response.json())
    // .then((data) => 
    // handleInputChange("opening_amt", data.oa)
    // )
    // .catch((error) =>{
    //     console.log(error);
    // },[]);

    

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
        diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(parseFloat(formData.cash_dep_bank)+parseFloat(formData.cash_dep_arcpl)+parseFloat(formData.cash_kpt)),
        total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
        diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
        total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
        user_id: id,
        plaza_code:formData.plaza_code,
        date_rep:formData.test
      };
      const formDataWithDerived = { ...formData, ...derivedData };
      console.log("Form submitted!",formDataWithDerived);
      const res = await fetch(api+'updateplazareport',{
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
          alert("Entry Updated Successfully ");
          setalert(true);
        }else{
          if(responseData.ResponseCode === "402"){
            alert("Error");
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
      diff_cash_tp:       (parseFloat(formData.adv_from_ho)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_cash_recievable))-(parseFloat(formData.cash_dep_bank)+parseFloat(formData.cash_dep_arcpl)+parseFloat(formData.cash_kpt)),
      total_fast_tag_rec: (parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj),
      diff_reciev :       parseFloat(formData.fst_tg_trf_bnk) - ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj)),
      total_coll:         ((parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)) - parseFloat(formData.excess_amt_adj))+(parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)),
      user_id: id,
      plaza_code:formData.plaza_code,
      date_rep:formData.date_rep
    };
    const formDataWithDerived = { ...formData, ...derivedData };
    console.log("Form submitted!",formDataWithDerived);
    const res = await fetch(api+'updateplazareport',{
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
        alert("Entry Updated Successfully ");
        setalert(true);
      }else{
        if(responseData.ResponseCode === "402"){
          alert("Erorr");
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
              // value={formData.date_rep}
              defaultValue={formData.date_rep}
              onChange={(e) =>{handleDateChange("test", e.target.value)}} 
               />
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
              value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)}
               disabled />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Fast Tag Receivable
              </label>
              <input type="number" placeholder="Total Fast Tag Receivable" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
               disabled />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Difference Cash in Toll Plaza
              </label>
              <input type="number"  placeholder="Difference Cash in Toll Plaza" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)-parseFloat(formData.cash_dep_bank)-parseFloat(formData.cash_dep_arcpl)-parseFloat(formData.cash_kpt)}
               disabled/>
               {/* {console.log(parseFloat(formData.opening_amt)+parseFloat(formData.adv_from_ho)+parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)-parseFloat(formData.cash_dep_bank)-parseFloat(formData.cash_dep_arcpl)-parseFloat(formData.cash_kpt))} */}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Total Collection
              </label>
              <input type="number" placeholder="Total Collection" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={parseFloat(formData.total_cash_recievable)+parseFloat(formData.balaji)+parseFloat(formData.monthly_pass_amt)+parseFloat(formData.total_fast_tag_cl)+parseFloat(formData.short_amt_adj)-parseFloat(formData.excess_amt_adj)}
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
          Plaza Entry
          {/* {pname} */}
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