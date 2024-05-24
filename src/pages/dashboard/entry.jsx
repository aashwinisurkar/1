import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Chip, Button,CardFooter } from "@material-tailwind/react";
import api from "@/ApiLink.mjs";
import CryptoJS from 'crypto-js';
import AddTollUser from '@/AddTollUser';
import PlazaReport from '@/PlazaReport';
import OperatorPlazareport from '@/OperatorPlazareport';
import {
  XMarkIcon 
} from "@heroicons/react/24/solid";

export function Entry() {
//   const [TABLE_ROWS, SET_TABLE_ROWS] = useState([]);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [user , setuser] = useState(false);
  const [plazaModalOpen, setPlazaModalOpen] = useState(false);
  const [cstat,setstat] = useState('');

  const openPlazaModal = () => {
    setPlazaModalOpen(true);
  };

  const closePlazaModal = () => {
    setPlazaModalOpen(false);
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


  
  const checkstatus = () =>{
    const decrydata = decryptAndRetrieveData("Harry");
    fetch(api+'checkstats',{
      method:'POST',
      body: JSON.stringify({id: decrydata.user.id})
    })
    .then((response)=>response.json())
    .then((data)=> setstat(data.ResponseCode))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });
  }
  const decrydata = decryptAndRetrieveData("Harry");

  useEffect(() => {
    if (!decrydata) {
      window.location.href = '/';
    }
    const refresh = setInterval(checkstatus,20000);
    if(cstat=='403'){
      // setlogoutdialog(true);
      window.location.href='/';
    }
  }, []);

//   const totalPages = Math.ceil(TABLE_ROWS.length / itemsPerPage);
//   const indexOfLastIte = currentPage * itemsPerPage;
//   const indexOfFirstIte = indexOfLastIte - itemsPerPage;
//   const currentItems = TABLE_ROWS.slice(indexOfFirstIte, indexOfLastIte);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const addUser = () => {
    
//     setuser(!user);
    
//   };

  // const addReport = () => {
    
  //   setuser(!user);
    
  // };

  return (
    <>
      <div className=" mt-10 flex items-center justify-center ml-5 mb-[370px]">
      
    <Card className="mt-6 w-96">
      <CardBody>
        <Typography variant="h3" color="blue-gray" className="mt-1 mb-2 text-center">
          Plaza Entry
        </Typography>
      </CardBody>
      <CardFooter className="pt-0 text-center">
        {/* <Button onClick={}>Add</Button> */}
        <Button onClick={openPlazaModal}>Add</Button>
      </CardFooter>
    </Card>
      </div>
      {/* {plazaModalOpen && (
              <div className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex flex-col items-center justify-center mt-[-20px]'>
                <div className='bg-white w-[750px]'>
                  <div className="flex flex-row-reverse mt-[5px] mb-[-10px]"> */}
                    {/* <button type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-black hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 h-[5px]"
                      onClick={closePlazaModal}>
                      <span class="sr-only">Close menu</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div> */}
                  {/* <PlazaReport /> */}
                  {/* <OperatorPlazareport />
                </div>
              </div>
            )} */}
            {plazaModalOpen && (
              <div className='fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex flex-col items-center justify-center mt-[-20px]'>
                <div className=''>
                {/* bg-green-400 */}
                  <div className="flex flex-row-reverse mt-[5px] mb-[-10px]">
                    <button type="button" class="rounded-md p-2 inline-flex items-center justify-center text-black hover:text-black hover: focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 h-[5px]"
                      // onClick={closePlazaModal}
                      >
                      {/* <span class="sr-only">Close menu</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg> */}
                      <div className='h-[20px] w-[15px] cursor-pointer'>
                      <XMarkIcon
                      color='white'
                      className='h-[40px] cursor-pointer'
                      onClick={closePlazaModal} /> 
                      </div>
                    </button>
                  </div>
                  {/* <PlazaReport /> */}
                  <OperatorPlazareport />
                </div>
              </div>
            )}
      {/* {user ? (<AddTollUser />) : <div></div>} */}
      
    </>
  );
}

export default Entry;

// {/* <Card className="mt-6 w-96">
//       <CardBody>
//         <Typography variant="h3" color="blue-gray" className="mt-1 mb-2 text-center">
//           Add Users
//         </Typography>
//       </CardBody>
//       <CardFooter className="pt-0 text-center">
//         {/* <Button onClick={}>Add</Button> */}
//         <Button onClick={addUser}>Add</Button>
//       </CardFooter>
//     </Card> */}

{/* <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Users Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Assigned Task
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(({ name, roll_name, is_active }, key) => {
                  const className = `py-3 px-5 ${
                    key === currentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {roll_name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={is_active === '1' ? "green" : "blue-gray"}
                          value={is_active === '1' ? "Active" : "InActive"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => handleEditClick({ name, roll_name, is_active })}
                        >
                          Edit
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-2 px-3 py-1 ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      </div> */}