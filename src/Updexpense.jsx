import React, { useEffect, useState } from 'react';
import api from './ApiLink.mjs';
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Alert
} from "@material-tailwind/react";
 
export default function Updexpense({plazaname,plazaid,plazaremitance,plazaaddress,plazaopn,plazavalidf,plazavalidt,userid,check}) {
  const [open, setOpen] = React.useState(true);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [name, setName] = useState(plazaname);
  const [addr, setAddr] = useState(plazaaddress);
  const [remi, setremi] = useState(plazaremitance);
  const [opn, setopening] = useState(plazaopn);
  const [valid_from,setfrom] = useState(plazavalidf);
  const [valid_to,setto] = useState(plazavalidt);
  const [expid,setid ] = useState(plazaid);
  const [uid,setuid] = useState(userid);
  const [show_exp,setshowexp] = useState(0);
  const [checkbox,setcheckbox] = useState(check == 1);
    // console.log(checkbox);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(name === ''){
      alert("Enter all details");
    }else{
      // console.log(uid);
      if(checkbox){
        setshowexp(1);
        // console.log(checkbox+"hi");
      }else{
        setshowexp(0);
        // console.log(checkbox);
      }
    fetch(api + 'updexpense', {
      method: "POST",
      body: JSON.stringify({
        name,
        uid,
        expid,
        show_exp: checkbox ? 1 : 0
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setOpen1(true);
        setOpen(false);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    }
  }

  return (
    <>
    <div className='fixed top-0 right-[37%]  p-4 w-[150px]'>
    <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
        Expense Updated
      </Alert>
      </div>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="bg-white shadow-none"
      >
        <form onSubmit={handleSubmit}>
          
          <div className='w-full mb-2 text-[30px] text-center bg-black text-white'>Update Expense Head</div>
          <div className="flex flex-wrap">
          <div className="w-full  px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Expense Name
              </label>
              <input type="text" placeholder="Expense Name"  className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={name}
              onChange={(e) => setName(e.target.value)}
               />
            </div>
          </div>
          
         
         
        </div>
        <Checkbox label="Show in Expenses?" checked={checkbox} onChange={() => setcheckbox(!checkbox)} />
        {/* {check?
        <Checkbox label="Show in Expenses?" defaultChecked onClick={() => setcheckbox(!checkbox)} />
      :
      <Checkbox label="Show in Expenses?"  onClick={() => setcheckbox(!checkbox)} />
      } */}
        <div className='flex justify-center items-center mb-2'>
         <Button variant="gradient" type="submit" className='w-[250px] rounded-none '>
                Add Expense
              </Button>
              </div>
        </form>
      </Dialog>
    </>
  );
}
