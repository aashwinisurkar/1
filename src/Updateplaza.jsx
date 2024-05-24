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
 
export default function Updateplaza({plazaname,plazaid,plazaremitance,plazaaddress,plazaopn,plazavalidf,plazavalidt,userid,ptype_,contract_}) {
  const [open, setOpen] = React.useState(true);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [name, setName] = useState(plazaname);
  const [addr, setAddr] = useState(plazaaddress);
  const [remi, setremi] = useState(plazaremitance);
  const [opn, setopening] = useState(plazaopn);
  const [valid_from,setfrom] = useState(plazavalidf);
  const [valid_to,setto] = useState(plazavalidt);
  const [plaza_id,setid ] = useState(plazaid);
  const [uid,setuid] = useState(userid);
  const [type,settype]=useState(ptype_);
  const [contract,setcontract] = useState(contract_);

//   useEffect(() => {
//     setName(plazaname);
//     setAddr(plazaaddress);
//     setfrom(plazavalidf);
//     setto(plazavalidt);
//     setopening(plazaopn);
//     setremi(plazaremitance);
//     setid(plazaid);
//   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(name === '' || addr === ''|| remi === ''|| valid_from===''|| valid_to===''|| opn ===''){
      alert("Enter all details");
    }else{
    fetch(api + 'updplaza', {
      method: "POST",
      body: JSON.stringify({
        name,
        addr,
        remi,
        opn,
        valid_from,
        valid_to,
        plaza_id,
        uid,
        type,
        contract
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
    <div className='fixed top-0 right-[37%]  p-4 w-[250px]'>
    <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
        Plaza Updated
      </Alert>
      </div>
      <Dialog
        size="xl"
        open={open}
        handler={handleOpen}
        className="bg-white shadow-none"
      >
        <form onSubmit={handleSubmit}>
          {/* <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Add Plaza
              </Typography>
              <Typography
                className="mb-3 font-normal"
                variant="paragraph"
                color="gray"
              >
                Enter Plaza name and Address
              </Typography>
              <div className='flex flex-wrap'>
              <Typography className="-mb-2" variant="h6">
                Plaza Name
              </Typography>
              <Input
                label="Plaza Name"
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Typography className="-mb-2" variant="h6">
                Address
              </Typography>
              <Input
                label="Address"
                size="lg"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
              />
              <Typography className="-mb-2" variant="h6">
                Remitance
              </Typography>
              <Input
                label="Remitance"
                size="lg"
                value={remi}
                onChange={(e) => setremi(e.target.value)}
                type='number'
              />
              <Typography className="-mb-2" variant="h6">
                Opening Amount
              </Typography>
              <Input
                label="Opening Amount"
                size="lg"
                value={opn}
                onChange={(e) => setopening(e.target.value)}
                type = 'number'
              />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" type="submit" fullWidth>
                Add Plaza
              </Button>
            </CardFooter>
          </Card> */}
          <div className='w-full mb-2 text-[30px] text-center bg-black text-white'>Update Plaza</div>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Valid From
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder=""
              defaultValue={plazavalidf}
              onChange={(e) => setfrom(e.target.value)}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Valid To
              </label>
              <input type="date" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder=""
               defaultValue={plazavalidt}
              onChange={(e) => 
                // console.log(e.target.value)
                setto(e.target.value)}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Name
              </label>
              <input type="text" placeholder="Plaza Name"  className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={name}
              onChange={(e) => setName(e.target.value)}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Address
              </label>
              <input type="text" placeholder="Address" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
               />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Remittance
              </label>
              <input type="number" placeholder="Remittance" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
               value={remi}
               onChange={(e) => setremi(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Opening Amount
              </label>
              <input type="number" placeholder="Opening Amount" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
              value={opn}
              onChange={(e) => setopening(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Contract Amount
              </label>
              <input type="number" placeholder="Opening Amount" className="border-4 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" 
              value={contract}
              onChange={(e) => setcontract(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-5">
              <label className="block uppercase text-blueGray-600 text-[20px] font-bold mb-2" htmlfor="grid-password">
                Plaza Type
              </label>
              <select
            id="option"
            name="option"
            onChange={(e) => settype(e.target.value)}
            value={type}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Type</option>
            <option value="1">Regular Plaza</option>
            <option value="0">Limited Plaza</option>
          </select>
            </div>
          </div>
        </div>
        <div className='flex justify-center items-center mb-2'>
         <Button variant="gradient" type="submit" className='w-[250px] rounded-none '>
                Add Plaza
              </Button>
              </div>
        </form>
      </Dialog>
    </>
  );
}
