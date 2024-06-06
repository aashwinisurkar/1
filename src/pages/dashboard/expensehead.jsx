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
import AddTollUser from '@/AddTollUser';
import PlazaReport from '@/PlazaReport';
import EditTollUser from '@/EditTollUser';
import AddPlaza from '@/AddPlaza';
import FilePlaza from '@/FilePlaza';
import Updateplaza from '@/Updateplaza';

import Updexpense from '@/Updexpense';
import Addexpense from '@/Addexpense';
import {
  TrashIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import Example from '@/Maintain';


export function ExpenseHead() {
  const [TABLE_ROWS, SET_TABLE_ROWS] = useState([]);
  const [Plaza_TABLE_ROWS, SET_Plaza_TABLE_ROWS] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [plazaPerPage, setplazaPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [plazacurrentPage, setplazaCurrentPage] = useState(1);
  const [user , setuser] = useState(false);


  const [plazaModalOpen, setPlazaModalOpen] = useState(false);
  const [plazaOpen, setPlazaOpen] = useState(false);
  const [warn,setwarn] = useState(false);
  
  const [editplazaf,seteditplaza] = useState(false);
  const [plaza_det,setplazadet] = useState([]);
  const [logoutdialog,setlogoutdialog] = useState(false);
  const [erropen1, seterrOpen1] = useState(false);
  const [data,setdata] = useState([]);
  const [user_id,set_user_id] = useState('');
  const [open,setopen] = useState(false);
  const [ searchData , setSearchData] = useState();
  const [showAddDialog, setShowAddDialog] = useState(false);
  // const [isSearchActive, setSearchActive] = useState(false);
    

  const openPlazaModal = () => {
    setPlazaModalOpen(!plazaModalOpen);
  };

  const closePlazaModal = () => {
    setPlazaModalOpen(false);
  };

  // const handleEditClick = (rowData) => {
  //   // Log the information to the console or perform any other action
  //   setupduser(rowData);
  //   // console.log("Edit Clicked. Row Data:", rowData);
  //   setupform(!upform);
  //   // If you want to open a modal or perform other actions, you can do it here
  // };

  // const handleplazaEditClick = (rowData) => {
  //   // Log the information to the console or perform any other action
  //   // setupduser(rowData);
  //  setwarn(true); 
  //   // console.log(rowData);
  //   setSize(rowData.value);
  //   setplazaid(rowData.plaza_id);
    
    
  // };

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

  const expenseData = () =>{
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
    if (!decrydata) {
      window.location.href = '/';
    } else {
      if(decrydata.user.role != 'Admin'){
        window.location.href = '/';
      }
      expenseData ();
      const refresh = setInterval(expenseData,20000);
      // const refresh1 = setInterval(checkstatus,10000);
    }
  }, []);


  const filteredData= Plaza_TABLE_ROWS.filter((item) =>
    item.name.toLowerCase().includes(searchData ?.toLowerCase() ||''));
  
  const plazaPages = Math.ceil(filteredData.length/ plazaPerPage);
  const plazaIndexOfLastItem = plazacurrentPage * plazaPerPage;
const plazaIndexOfFirstItem = plazaIndexOfLastItem - plazaPerPage;
// const currentItems = filteredData.slice(indexOfFirstIte, indexOfLastIte);
const plazacurrentItems = filteredData.slice(plazaIndexOfFirstItem, plazaIndexOfLastItem);




  const handleSearch = (e) => {
    setSearchData(e.target.value);
  };
  // const handleSearchIconClick = () => {
  //   setSearchActive(!isSearchActive);
  // };

  const handleClear = () => {
    setSearchData("");
  };


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
  const editexpense = (rowData) =>{
   
    setShowAddDialog(! showAddDialog);
    setplazadet(rowData);
  }
  const openAddExpenseModal = () => {
    setShowAddDialog(true);
  };

 

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
   
   
    
     

{plazaModalOpen && (

        <div className='w-[150px]'>
            <Addexpense
              userid={user_id}
            />
        </div>
)}

      {user ? (<AddTollUser 
      user_id_={user_id}
      />) : <div></div>}
      {logoutdialog ? (
        <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
        Updation Failed
        {window.location.href='/'}
      </Alert>
      ):<div></div>}

      {/* {plazaOpen ? (<AddPlaza
      user_id={user_id} 
      />) : <div></div>} */}

      {/* {editplazaf ? (<Updateplaza
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
      /> ): <div></div>} */}
      {/* {upform ? (<EditTollUser 
      getid={upduser.id}
      getname={upduser.name}
      getrole={upduser.roll_name}
      getroleid={upduser.role_id}
      getplaza={upduser.plaza}
      getplazaid={upduser.plaza_id}
      getemail={upduser.email}
      getmobile={upduser.mobile}
      getisactive={upduser.is_active}
      

      />) : <div></div>} */}
       {showAddDialog ? 
        <div className='w-[150px]'>
        <Updexpense
              userid={user_id}
              plazaname={plaza_det.name}
              plazaid={plaza_det.id}
              check={plaza_det.show_in}
        />
        </div>
        :<div></div>}
        <div>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 py-4  ">
      <div className="flex ml-5 justify-between items-center">
        <Typography variant="h4" >
        Add Expense
        </Typography>
        <div className="  justify-start flex">
        <div className='ml-30 relative flex items-center'>
        {/* <Button className=" absolute bg-blue-800 text-white ml-0  px-2 py-[8px]  flex items-center">
    <MagnifyingGlassIcon className="h-6 w-6" />
  </Button> */}
       <input 
            type="search" 
            value={searchData}
            placeholder="Search expenses" 
            className="border text-center border-gray-300 text-gray-800 rounded-lg px-4 py-2 "
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
          onClick={openPlazaModal}>ADD EXPENSE</Button>
          </div>
          
        </div>
      </div>
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
                              {/* <Typography className='hidden'>{id}{show_in}</Typography> */}
                            </Typography>
                          </div>
                        </div>
                      </td>
                     
                      <td className={className}>
                        <div className='flex justify-start items-start'>
                        
                        <div className=' mt-[-3px] sh-5 w-5 mx-5 cursor-pointer '>
                          <PencilSquareIcon color='green'
                          onClick={() => editexpense({ name,id,show_in })}
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
              {Array.from({ length:plazaPages }, (_, index) => (
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
      </div>
    </>
  );
};
export default ExpenseHead;
