import React,{useEffect,useState} from 'react';
import api from './ApiLink.mjs';
import Updexpense from './Updexpense';
import Addexpense from '@/Addexpense';
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
    Alert,
    Input
  } from "@material-tailwind/react";
export default function Expenseheadtb() {
    const [plazaPerPage, setplazaPerPage] = useState(10);
    const [Plaza_TABLE_ROWS, SET_Plaza_TABLE_ROWS] = useState([]);
    const [plazacurrentPage, setplazaCurrentPage] = useState(1);
    const [plazaModalOpen, setPlazaModalOpen] = useState(false);
    const [showdialog,setshowdialog] = useState(false);
    const [user_id,set_user_id] = useState('');
    const [plaza_det,setplazadet] = useState([]);
    const [ searchData , setSearchData] = useState();
    const [showAddDialog, setShowAddDialog] = useState(false);
    



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

  const handleClear = () => {
    setSearchData("");
  };
  const openPlazaModal = () => {
    setPlazaModalOpen(!plazaModalOpen);
  };

  const closePlazaModal = () => {
    setPlazaModalOpen(false);
  };

  const plazapaginate = (pageNumber) =>{
    setplazaCurrentPage(pageNumber);
  }
  const editexpense = (rowData) =>{
   
    setshowdialog(!showdialog);
    setplazadet(rowData);
  }
  const openAddExpenseModal = () => {
    setShowAddDialog(true);
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

    tabdata();
   const refresh = setInterval(tabdata, 10000);
   return () => clearInterval(refresh);
  },[]);
  return (
    <>

{/* <Dialog
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
      </Dialog> */}
    

{/* {plazaModalOpen && (

<div className='w-[150px]'>
    <Addexpense
      userid={user_id}
    />
</div>
)} */}

{plazaModalOpen && (

<div className='w-[150px]'>
<Addexpense
userid={user_id}
/>
</div>
)}


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

    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 py-2">
          <div className="flex justify-between items-center">
        <Typography variant="h4" >
                Add Expense
                </Typography>
        <div className="  justify-start flex">
        <div className='ml-30 relative flex items-center'>
       <Input
            type="search" 
            value={searchData}
            placeholder="Search users" 
            className="border border-gray-300 text-gray-800 rounded px-4 py-2 "
            onChange={handleSearch}
          /> 
         
       </div>
       <div className='mr-10'>
          <Button
          className='buttons py-3 bg-blue-800 focus-within:shadow-lg   ml-[150px] px-8'
          color='gray'
        onClick={openPlazaModal}>Add</Button>
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
                              {/* <Typography className='hidden'>{id}{show_in}</Typography> */}
                            </Typography>
                          </div>
                        </div>
                      </td>
                     
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

        {/* {plazaModalOpen && (

      <div className='w-[150px]'>
    <Addexpense
      userid={user_id}
    />
</div>
)} */}


        
 
        </div>
       
    </>
  )
}
