import React,{useEffect,useState} from 'react';
import api from './ApiLink.mjs';
import Updexpense from './Updexpense';
import CryptoJS from 'crypto-js';
import {
    TrashIcon,
    PencilSquareIcon,
    XMarkIcon
  } from "@heroicons/react/24/solid";
  import { Card, 
    CardHeader,
     CardBody, 
     Typography, 
     Chip, 
     Button,
     CardFooter,
     Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter, 
    Alert
  } from "@material-tailwind/react";
export default function Expenseheadtb() {
    const [plazaPerPage, setplazaPerPage] = useState(5);
    const [Plaza_TABLE_ROWS, SET_Plaza_TABLE_ROWS] = useState([]);
    const [plazacurrentPage, setplazaCurrentPage] = useState(1);
    const [showdialog,setshowdialog] = useState(false);
    const [user_id,set_user_id] = useState('');
    const [plaza_det,setplazadet] = useState([]);
    const plazaPages = Math.ceil(Plaza_TABLE_ROWS.length/ plazaPerPage);
    const plazaIndexOfLastItem = plazacurrentPage * plazaPerPage;
  const plazaIndexOfFirstItem = plazaIndexOfLastItem - plazaPerPage;
  const plazacurrentItems = Plaza_TABLE_ROWS.slice(plazaIndexOfFirstItem, plazaIndexOfLastItem);
  const plazapaginate = (pageNumber) =>{
    setplazaCurrentPage(pageNumber);
  }
  const editexpense = (rowData) =>{
    // console.log(rowData);
    // seteditplaza(!editplazaf);
    setshowdialog(!showdialog);
    setplazadet(rowData);
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

  const tabdata = () =>{
    fetch(api + 'expensehead')
        .then((response) => response.json())
        .then((data) => {
          // SET_TABLE_ROWS(data.data);
          // console.log(data);
          SET_Plaza_TABLE_ROWS(data);
        })
        .catch((error) => {
          console.error('Error Fetching Data: ', error);
        });
  }
  useEffect(() => {
    const dataitem = localStorage.getItem('encryptedData');
    if(dataitem === null){
      window.location.href='/';
    }

    const decrydata1 = decryptAndRetrieveData("Harry");
    set_user_id(decrydata1.user.id);

    fetch(api + 'expensehead')
        .then((response) => response.json())
        .then((data) => {
          // SET_TABLE_ROWS(data.data);
          // console.log(data);
          SET_Plaza_TABLE_ROWS(data);
        })
        .catch((error) => {
          console.error('Error Fetching Data: ', error);
        });
        tabdata();
        const refresh = setInterval(tabdata,10000);

  },[]);
  return (
    <>
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Expense Head
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
                      Actions
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {plazacurrentItems.map(({ name,id,show_in }, key) => {
                  const className = `py-3 px-5 ${
                    key === plazacurrentItems.length - 1
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
                              {name.toUpperCase()}
                              <Typography className='hidden'>{id}{show_in}</Typography>
                            </Typography>
                          </div>
                        </div>
                      </td>
                      {/* <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {addr.toUpperCase()}<Typography className='hidden'>{plaza_id}{valid_from}{valid_to}{opn_amt}</Typography>
                        </Typography>
                      </td> */}
                      {/* <td className={className}>
                        <Chip
                          variant="gradient"
                          color={is_active === '1' ? "green" : "blue-gray"}
                          value={is_active === '1' ? "ONLINE" : "OFFLINE"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td> */}
                      {/* <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {remitance}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {opn_amt}
                        </Typography>
                      </td> */}
                      <td className={className}>
                        <div className='flex justify-start items-start'>
                        {/* <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => handleplazaEditClick({ name, addr, is_active,role_id,plaza,plaza_id,id,mobile,email,value:'xs' })}
                        > */}
                        <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                          <PencilSquareIcon color='green'
                          onClick={() => editexpense({ name,id,show_in })}
                          />
                          </div>
                        {/* </Typography> */}
                        {/* <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                          
                        <TrashIcon
                        color='red'
                        onClick={() => handleplazaEditClick({ name, addr, is_active,plaza_id,value:'xs' })}
                        />
                        
                        </div> */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: plazaPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => plazapaginate(index + 1)}
                  className={`mx-2 px-3 py-1 ${
                    plazacurrentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
        {showdialog ? 
        <div className='w-[150px]'>
        <Updexpense
              userid={user_id}
              plazaname={plaza_det.name}
              plazaid={plaza_det.id}
              check={plaza_det.show_in}
        />
        </div>
        :<div></div>}
        </div>
    </>
  )
}
