import React,{useState,useEffect} from 'react';
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import {
    ArrowPathIcon
  } from "@heroicons/react/24/solid";
  import api from './ApiLink.mjs';
  // const TABLE_HEAD1 = ["Sr no","Date", "Plaza Name","Expense no","Amount","Narration"];
  const TABLE_HEAD1 = ["Sr no","Date", "Plaza Name","Expense no","Amount"];
  
export default function TpexpReport() {

    const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    plaza_code: '',
    to: currentDate,
    from: currentDate,
    exp_id:''
  });
  const [showTable,setshowTable] = useState(false);
  const [plazas, setPlazas] = useState([]);
  const [TABLE_ROWS,setrows] = useState([]);
  const [options,setoptions] = useState([]);
  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const fdate = (value) =>{
    const date = new Date(value);
    const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' }).toUpperCase()}-${date.getFullYear()}`;
    return formattedDate;
  }

  const handlePlazaChange = (value) => {
    setshowTable(false);
    setFormData({
      ...formData,
      plaza_code: value,
    });
  };

  const handleExpChange = (value) => {
    setshowTable(false);
    setFormData({
      ...formData,
      exp_id: value,
    });
  };

  const handleGetResult = async(e) => {
    e.preventDefault();
    const res = await fetch(api+'tollexpense_detail',{
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
      exp_id:null
    });
    setshowTable(false);
  }

  useEffect(() => {
    
    fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        setPlazas(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      },[]);

      fetch(api+'expensehead')
      .then((response) => response.json())
      .then((data) => {
        setoptions(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
  },[]);

  return (
    <>
    <div className='bg-gray-100 h-[100%] mb-[400px]'>
      <div className='my-5 ml-[-150px]'>
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
          <div className='mt-[5px]'>
          <select label="Choose Expense"
          onChange={(e) => handleExpChange(e.target.value)}
          value={formData.exp_id === null ? '' : formData.exp_id}
          className="w-[200px] border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Expense</option>
            {options.map((option) => (
              <option  value={option.id}>
                {option.name}
            </option>
          ))}
          </select>
          
          </div>
          <Button className='mx-5 bg-blue-500 '  onClick={handleGetResult}>
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
        <div className="overflow-x-auto w-[100%] mt-10">
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
              {TABLE_ROWS.map(({ date_rep, plaza,expense,amount,narration }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  <td className="p-3 border-2 w-[10px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[80px]">
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
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      {expense}<br/>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                      {narration}
                    </Typography>
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[20px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {amount}
                    </Typography>
                  </td>
                  {/* <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {narration}
                    </Typography>
                  </td> */}
                  
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
  )
}
