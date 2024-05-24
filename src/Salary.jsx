import React,{useEffect, useState} from 'react'
import api from "./ApiLink.mjs";
import { Button, Card, Typography , Drawer ,IconButton} from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";
import CryptoJS from "crypto-js";

const TABLE_HEAD1 = ["Sr no","Salary Month", "Plaza Name","Salary Amount","Narration"];
export default function Salary() {
    const [open1, setOpen1] = useState(false);
    const [showform,setshowform] = useState(false);
    const [row,setrow] = useState([]);
    const [open, setOpen] = useState(true);
    const [erropen1, seterrOpen1] = useState(false);
    const [plaza,setplaza] = useState([]);
    const [years,setyears] = useState([]);
    const [months, setMonths] = useState([
        {name:'January',id:1},
        {name:'February',id:2},
        {name:'March',id:3},
        {name:'April',id:4},
        {name:'May',id:5},
        {name:'June',id:6},
        {name:'July',id:7},
        {name:'August',id:8},
        {name:'September',id:9},
        {name:'October',id:10},
        {name:'November',id:11},
        {name:'December',id:12}
    ]);

    const [salary_month,setsalmonth] = useState('');
    const [salary_year,setsalyear] = useState('');
    const [salary_plaza,setsalplaza] = useState('');
    const [uid,setuid] = useState('');
    const [narration,setnarr] = useState('');
    const [amount,setamt] = useState('');  

    // console.log(plaza);

    const closeDrawer = () => setshowform(false);
   
    const handleamount = (value) =>{
        const fvalue = parseFloat(value);
        if(!isNaN(fvalue) && fvalue>=0){
            setamt(fvalue);
        }else{
            setamt(0);
        }
    }

    const resetform = () =>{
    setsalmonth('');
    setsalyear('');
    setsalplaza('');
    setnarr('');
    setamt('');
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        // console.log("Year: ",salary_year);
        // console.log("Month: ",salary_month);
        // console.log("Plaza: ",salary_plaza);
        // console.log("Amount: ",amount);
        // console.log("uid: ",uid);
        // console.log("Narration: ",narration);
        if(salary_year === '' || salary_month ===''|| salary_plaza===''||amount===''||uid===''|| narration ===''){
            alert("Enter all Fields");
          }else{
            const response = await fetch(api+'insertsalaryprovision', {
                method: "POST",
                
                body: JSON.stringify({
                  salary_year,
                  salary_month,
                  salary_plaza,
                  amount,
                  uid,
                  narration
                })
              
              });
      
              
              
              const data = await response.json();
            //   console.log(data);
            if(data.ResponseCode==402){
                seterrOpen1(true);
                setOpen(false);
                setshowform(false);
                resetform();
            }else{
                if(data.ResponseCode==200){
                    setOpen1(true);
                    setOpen(false);
                    setshowform(false);
                    resetform();
                }
            }
          }


    };

    const fdate1 = (value1,value2) =>{
        const month = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const formattedDate = `${month[value1-1]}-${value2}`;
        return formattedDate;
    }

      const handleGetResult = () =>{
        setshowform(true);
        setOpen(true);
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
      
    useEffect(()=>{
        // salary table start
        fetch(api+'getsalary',{
            method:'POST',
          })
          .then((response)=> response.json())
          .then((data)=>
          setrow(data)
          )
          .catch((error)=>{
            console.log(error);
          },[]);
          // salary table end
          // get plaza start
          fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        setplaza(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
          // get plaza end

          // year start
          const currentYear = new Date().getFullYear();
    const year = [];
    for(let i = 0;i<10;i++){
        year.push({ name: currentYear - i, id: currentYear - i });
    }
    setyears(year);
          // year end
          // fetch user id start
          const decrydata = decryptAndRetrieveData("Harry");
          setuid(decrydata.user.id);
          // fetch user id end
    },[showform]);
  return (
    <>
      {showform?

<>
<React.Fragment>
  <div className='fixed top-0 right-[37%]  p-4 w-[250px]'>
<Alert color="green" open={open1} onClose={() => setOpen1(false)}>
    Salary Added
  </Alert>
  <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
    Duplicate Entry of Provisional Salary
  </Alert>
  </div>
  {/* <Button onClick={openDrawer}>Open Drawer</Button> */}
  <Drawer open={open} onClose={closeDrawer} className="p-4" placement="right">
    <div className="mb-3 flex items-center justify-between">
      <Typography variant="h5" color="blue-gray">
        Add Salary Provision
      </Typography>
      <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </IconButton>
    </div>
    <Typography color="gray" className="mb-8 pr-4 font-normal">
    <div className="max-w-md mx-auto mt-0 p-1">
      <form
       onSubmit={handleSubmit}
       autocomplete="off"
       className="space-y-4">
      <div>
    <label htmlFor="option" className="block text-gray-700">Choose Month</label>
    <select
        id="option1"
        name="option"
        onChange={(e) => setsalmonth(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        <option value="" >Select Month</option>
        {months.map((option) => (
          <option  value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    <div>
    <label htmlFor="option" className="block text-gray-700">Choose Year</label>
    <select
        id="option1"
        name="option"
        onChange={(e) => setsalyear(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
      >
        <option value="" >Select Year</option>
        {years.map((option) => (
          <option  value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    <div>
    <label htmlFor="option" className="block text-gray-700">Choose Plaza</label>
    <select
        id="option1"
        name="option"
        onChange={(e) => setsalplaza(e.target.value)}
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
    <div>
          <label htmlFor="mobile" className="block text-gray-700">Amount</label>
          <input
            type="text"
            id="mobile"
            name="amount"
            value={amount}
            onChange={(e) => handleamount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-gray-700">Narration</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            onChange={(e) => setnarr(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
    <div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Add Salary
      </button>
    </div>

      </form>
      </div>
    </Typography>
    
  </Drawer>
</React.Fragment>
</>
      :
      <>
      <div className="overflow-x-auto w-[100%] mt-20">
        <div className='flex justify-end'>
        <Button className='mx-5 mb-5' color='blue' 
        onClick={handleGetResult}
        >
             Add Salary
          </Button>
          </div>
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD1.map((head) => (
                  <th key={head} className="border-2 border-blue-gray-100 bg-blue-gray-50 p-2 font-bold">
                    {/* <Typography
                      variant="small"
                      color="black"
                      className="font-bold leading-none opacity-70"
                    > */}
                      {head}
                    {/* </Typography> */}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row.map(({ date_rep, plaza,name,amount,narration,salary_month,salary_year }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-1 border-2 w-[10px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[2px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {fdate1(salary_month,salary_year)}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px] text-left">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                  <td className="p-1 border-2 w-[30px] text-right">
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
