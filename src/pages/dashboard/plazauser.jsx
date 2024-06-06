import React, { useEffect, useState } from 'react';
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
import api from "@/ApiLink.mjs";
import CryptoJS from 'crypto-js';
// import AddTollUser from '@/AddTollUser';
// import PlazaReport from '@/PlazaReport';
// import EditTollUser from '@/EditTollUser';
import AddPlaza from '@/AddPlaza';
import FilePlaza from '@/FilePlaza';
import Updateplaza from '@/Updateplaza';

import {
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";


export function Plazatable() {
  const [TABLE_ROWS, SET_TABLE_ROWS] = useState([]);
  const [Plaza_TABLE_ROWS, SET_Plaza_TABLE_ROWS] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [plazaPerPage, setplazaPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [plazacurrentPage, setplazaCurrentPage] = useState(1);
  const [user , setuser] = useState(false);
  const [upform , setupform] = useState(false);
  const [upduser , setupduser] = useState([]);
//   const [plazaModalOpen, setPlazaModalOpen] = useState(false);
  const [plazaOpen, setPlazaOpen] = useState(false);
  const [warn,setwarn] = useState(false);
  const [size, setSize] = React.useState(null);
  const [plazaid,setplazaid] = useState('');
  const [editplazaf,seteditplaza] = useState(false);
  const [plaza_det,setplazadet] = useState([]);
  const [logoutdialog,setlogoutdialog] = useState(false);
  const [erropen1, seterrOpen1] = useState(false);
  const [data,setdata] = useState([]);
  const [user_id,set_user_id] = useState('');
  const [open,setopen] = useState(false);
  const [ searchPlaza , setSearchPlaza] = useState();

//   const openPlazaModal = () => {
//     setPlazaModalOpen(!plazaModalOpen);
//   };

//   const closePlazaModal = () => {
//     setPlazaModalOpen(false);
//   };

const handleSearch = (e) => {
   setSearchPlaza(e.target.value);
  };

  const handleClear = () => {
   setSearchPlaza("");
  };

  const handleEditClick = (rowData) => {
    // Log the information to the console or perform any other action
    setupduser(rowData);
    // console.log("Edit Clicked. Row Data:", rowData);
    setupform(!upform);
    // If you want to open a modal or perform other actions, you can do it here
  };

  const handleplazaEditClick = (rowData) => {
    // Log the information to the console or perform any other action
    // setupduser(rowData);
    setwarn(true);
    // console.log(rowData);
    setSize(rowData.value);
    setplazaid(rowData.plaza_id);
    
   
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

  const decrydata = decryptAndRetrieveData("Harry");

  
  
  const checkstatus = () =>{
    const decrydata1 = decryptAndRetrieveData("Harry");
    set_user_id(decrydata1.user.id);
    fetch(api+'checkstats',{
      method:'POST',
      body: JSON.stringify({id: decrydata1.user.id})
    })
    .then((response)=>response.json())
    .then((data)=> setdata(data))
    .catch((error) => {
      console.error('Error Fetching Data: ', error);
    });
  }

  const tabledata = () =>{
    // fetch(api + 'manage_user')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       SET_TABLE_ROWS(data.data);
    //     })
    //     .catch((error) => {
    //       console.error('Error Fetching Data: ', error);
    //     });
      
        fetch(api + 'getplazadata')
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
    if (!decrydata) {
      window.location.href = '/';
    } else {
      if(decrydata.user.role != 'Admin'){
        window.location.href = '/';
      }
      tabledata();
      const refresh = setInterval(tabledata,20000);
      // const refresh1 = setInterval(checkstatus,10000);
    }
  }, []);

  const filteredData= Plaza_TABLE_ROWS.filter((item) =>
    item.name.toLowerCase().includes(searchPlaza?.toLowerCase() ||''));
  

  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const plazaPages = Math.ceil(Plaza_TABLE_ROWS.length/ plazaPerPage);
  const indexOfLastIte = currentPage * itemsPerPage;
  const indexOfFirstIte = indexOfLastIte - itemsPerPage;
  const currentItems = TABLE_ROWS.slice(indexOfFirstIte, indexOfLastIte);
  // const plazacurrentItems = Plaza_TABLE_ROWS.slice(indexOfFirstIte, indexOfLastIte);
  const plazaIndexOfLastItem = plazacurrentPage * plazaPerPage;
  const plazaIndexOfFirstItem = plazaIndexOfLastItem - plazaPerPage;
  const plazacurrentItems = filteredData.slice(plazaIndexOfFirstItem, plazaIndexOfLastItem);
  // console.log(Plaza_TABLE_ROWS);
  // console.log(currentItems);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const plazapaginate = (pageNumber) =>{
    setplazaCurrentPage(pageNumber);
  }

  const addUser = () => {
    
    setuser(!user);
    
  };
  const plazaadd = () =>{
    setPlazaOpen(!plazaOpen);
  }

  

  const editplaza = (rowData) =>{
    // console.log(rowData);
    seteditplaza(!editplazaf);
    setplazadet(rowData);
  }
 
  const handleOpen = (value) => setSize(value);

  const deletePlaza = (id) =>{

    // console.log(id);
    fetch(api+'delplaza',{
      method:'POST',
      body: JSON.stringify({plaza_id: id})
    })
    .then((response) => response.json())
        .then((data) => {
          // SET_TABLE_ROWS(data.data);
          // console.log(data);
          // SET_Plaza_TABLE_ROWS(data);
        })
        .catch((error) => {
          console.error('Error Fetching Data: ', error);
        });

    handleplazaEditClick(nullvar)
  }

  const nullvar = {
    value:null
  }
  return (
    <>
    <Dialog
        open={
          size === "xs" ||
          size === "sm" ||
          size === "md" ||
          size === "lg" ||
          size === "xl" ||
          size === "xxl"
        }
        size={size || "xs"}
        handler={handleplazaEditClick}
      >
        <div className='flex justify-center items-center'>
        <DialogHeader className='text-red-800 text-[40px]' >Warning</DialogHeader>
        </div>
        <div className='flex justify-center items-center '>
        <DialogBody className='text-[20px]'>
          Are you sure you want to delete plaza?
        </DialogBody>
        </div>
        <DialogFooter>
          <Button
            variant="text"
            color="green"
            onClick={() => handleplazaEditClick(nullvar)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={() => deletePlaza(plazaid)}
          >
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </Dialog>
   
    

{/* 
      {user ? (<AddTollUser 
      user_id_={user_id}
      />) : <div></div>} */}
      {logoutdialog ? (
        <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
        Updation Failed
        {window.location.href='/'}
      </Alert>
      ):<div></div>}
      {plazaOpen ? (<AddPlaza
      user_id={user_id} 
      />) : <div></div>}
      {editplazaf ? (<Updateplaza
      plazaname={plaza_det.name}
      plazaaddress={plaza_det.addr}
      plazaremitance={plaza_det.remitance}
      plazaid={plaza_det.plaza_id}
      plazaopn={plaza_det.opn_amt}
      plazavalidf={plaza_det.valid_from}
      plazavalidt={plaza_det.valid_to}
      userid={user_id}
      ptype_={plaza_det.ptype}
      contract_={plaza_det.contract}
      /> ): <div></div>}
      
      
       <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 py-4  ">
      <div className="flex justify-between ml-5 items-center">
        <Typography variant="h4"  >
           Plaza Table
        </Typography>
        <div className="  justify-start flex">
        <div className='ml-30 relative flex items-center'>
        {/* <Button className=" absolute bg-blue-800 text-white border  ml-0  px-2 py-[8px]  flex items-center">
    <MagnifyingGlassIcon className="h-6 w-6" />
  </Button> */}
       <input 
            type="search" 
            value={searchPlaza}
            placeholder="Search Plaza" 
            className="border border-gray-300 text-center  text-gray-800 rounded-lg  px-4 py-2 "
            onChange={handleSearch}

          /> 
           <div className=" absolute font-bold   text-black ml-0  px-2 py-[8px]  flex items-center">
              
              <MagnifyingGlassIcon className="h-7 w-7 " />
            </div>
                    
        
       </div>
       <div className='mr-10'>
          <Button
          className='buttons py-3 bg-blue-800 focus-within:shadow-lg   ml-[150px] px-8'
          color='gray'
          onClick={plazaadd}>Add plaza</Button>
          </div>
          
        </div>
      </div>
      
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr >
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Plaza Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Address
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Contract Amount
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Remitance
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Opening Amount
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
                {plazacurrentItems.map(({ name, addr, is_active,role_id,plaza,plaza_id,id,mobile,email,remitance,valid_from,valid_to,opn_amt,ptype,contract }, key) => {
                  const className = `py-3 px-5 ${
                    key === plazacurrentItems.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name} className="even:bg-blue-gray-50/50 ">
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name.toUpperCase()}
                              <Typography className='hidden'></Typography>
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {addr.toUpperCase()}<Typography className='hidden'>{plaza_id}{valid_from}{valid_to}{opn_amt}{ptype}{contract}</Typography>
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {contract}
                        </Typography>
                      </td>
                  
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {remitance}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {opn_amt}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className='flex justify-start items-start'>
                       
                        <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                          <PencilSquareIcon color='green'
                          onClick={() => editplaza({ name, addr, is_active,plaza_id,remitance,valid_from,valid_to,opn_amt,ptype,contract })}
                          />
                          </div>
                        {/* </Typography> */}
                        <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                        
                        <TrashIcon
                        color='red'
                        onClick={() => handleplazaEditClick({ name, addr, is_active,plaza_id,value:'xs' })}
                        />
                      
                        </div>
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
        </div>
    </>
  );
};
export default Plazatable;


