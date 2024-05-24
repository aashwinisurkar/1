import React,{useState,useEffect} from 'react';
import { Button, Card, Typography , Select, Option } from "@material-tailwind/react";
import {
    ArrowPathIcon
  } from "@heroicons/react/24/solid";
  import api from './ApiLink.mjs';
  const TABLE_HEAD1 = ["Name","Amount"];
  const TABLE_HEAD2 = ["Sr no","Name","Amount"];
  const TABLE_HEAD3 = ["Sr no","Name","Expense","Amount"];
export default function TpexSumReport() {

    const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    plaza_code: '',
    to: currentDate,
    from: currentDate,
    exp_id:''
  });
  const [TABLE_ROWS,setrows] = useState([]);
  const [showTable,setshowTable] = useState(false);

  const [TABLE_ROWS1,setrows1] = useState([]);
  const [showTable1,setshowTable1] = useState(false);

  const [TABLE_ROWS2,setrows2] = useState([]);
  const [showTable2,setshowTable2] = useState(false);

  const [TABLE_ROWS3,setrows3] = useState([]);
  const [showTable3,setshowTable3] = useState(false);
  
  const [plazas, setPlazas] = useState([]);
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
    setshowTable1(false);
    setshowTable2(false);
    setshowTable3(false);
    setFormData({
      ...formData,
      plaza_code: value,
    });
  };

  const handleExpChange = (value) => {
    setshowTable(false);
    setshowTable1(false);
    setshowTable2(false);
    setshowTable3(false);
    setFormData({
      ...formData,
      exp_id: value,
    });
  };

  const handleGetResult = async(e) => {
    e.preventDefault();
//     const res = await fetch(api+'tollexpense_summary',{
//       method: "POST",
//       body: JSON.stringify(formData)
//  }).then(resp => resp.json())
//  .then(data => 
//   setrows(data.Data)
//  );
//  setshowTable(true);
      const res = await fetch(api+'tollexpense_summary',{
        method:"POST",
        body:JSON.stringify(formData)
      });
      const d = await res.json();
    //   console.log(d);
    const Data = d.Data;
    if(d.ResponseCode === '201'){
        // console.log("201");
        setrows(d.Data);
        setshowTable(true);
    }
    if(d.ResponseCode === '202'){
        // console.log("202");
        setrows1(d.Data);
        setshowTable1(true);
    }
    if(d.ResponseCode === '203'){
        // console.log("203");
        setrows1(d.Data);
        setshowTable2(true);
    }
    if(d.ResponseCode === '204'){
        // console.log("204");
        setrows2(d.Data);
        setshowTable3(true);
    }
    
      
  };

  const resetform = async(e) =>{
    setFormData({
      from:currentDate,
      to:currentDate,
      plaza_code: null,
      exp_id:null
    });
    setshowTable(false);
    setshowTable1(false);
    setshowTable2(false);
    setshowTable3(false);
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
              {TABLE_ROWS.map(({ date_rep,amount,name }, index) => (
                <tr key={date_rep} className="even:bg-blue-gray-50/50 ">
                  {/* <td className="p-3 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td> */}
                  <td className="p-3 border-2 w-[130px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {name}
                    </Typography>
                  </td>
                  
                  <td className="p-3 border-2 w-[60px] text-right">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {amount}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
              <td className="p-3 border-2 w-[120px]  text-left">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      Total
                    </Typography>
                  </td>
                  {/*  */}
                  <td className="p-3 border-2 w-[60px] text-right">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      {TABLE_ROWS.reduce((sum,{amount}) => parseFloat(parseFloat(sum) + parseFloat(amount)).toFixed(2),0)}
                    </Typography>
                  </td>
              </tr>
            </tfoot>
          </table> 
        </Card>
      </div>
        </>:null
        }


{showTable1?
        <>
        <div className="overflow-x-auto w-[100%] mt-10">
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD2.map((head) => (
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
              {TABLE_ROWS1.map(({ name,amount }, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50 ">
                  <td className="p-3 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[150px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {name}
                    </Typography>
                  </td>
                  
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-right">
                      {amount}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
              <td className="p-3 border-2 w-[120px]  text-left">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      Total
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[120px]  text-left">
                    {/* <Typography variant="small" color="blue-gray" className="font-extrabold">
                      Total
                    </Typography> */}
                  </td>
                  <td className="p-3 border-2 w-[60px] text-right">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      {TABLE_ROWS1.reduce((sum,{amount}) => parseFloat(parseFloat(sum) + parseFloat(amount)).toFixed(2),0)}
                    </Typography>
                  </td>
              </tr>
            </tfoot>
          </table> 
        </Card>
      </div>
        </>:null
        }

{showTable2?
        <>
        <div className="overflow-x-auto w-[100%] mt-10">
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD2.map((head) => (
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
              {TABLE_ROWS1.map(({ name,amount }, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50 ">
                  <td className="p-3 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[150px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {name}
                    </Typography>
                  </td>
                  
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal text-right">
                      {amount}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
              <td className="p-3 border-2 w-[120px]  text-left">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      Total
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[120px]  text-left">
                    {/* <Typography variant="small" color="blue-gray" className="font-extrabold">
                      Total
                    </Typography> */}
                  </td>
                  <td className="p-3 border-2 w-[60px] text-right">
                    <Typography variant="small" color="blue-gray" className="font-extrabold">
                      {TABLE_ROWS1.reduce((sum,{amount}) => parseFloat(parseFloat(sum) + parseFloat(amount)).toFixed(2),0)}
                    </Typography>
                  </td>
              </tr>
            </tfoot>
          </table> 
        </Card>
      </div>
        </>:null
        }

{showTable3?
        <>
        <div className="overflow-x-auto w-[100%] mt-10">
        <Card className="h-full w-full">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              
              <tr>
                {TABLE_HEAD3.map((head) => (
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
              {TABLE_ROWS2.map(({ name,amount,expense }, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50 ">
                  <td className="p-3 border-2 w-[30px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {index+1}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[150px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {name}
                    </Typography>
                  </td>
                  <td className="p-3 border-2 w-[150px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {/* {fdate(date_rep)} */}
                      {expense}
                    </Typography>
                  </td>
                  
                  <td className="p-3 border-2 w-[120px]">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {amount}
                    </Typography>
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
  )
}
