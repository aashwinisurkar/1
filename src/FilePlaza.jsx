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
 
export default function FilePlaza({plazaname,plazaid,plazaremitance,plazaaddress}) {
  const [open, setOpen] = React.useState(true);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [name, setName] = useState('');
  const [addr, setAddr] = useState('');
  const [remi, setremi] = useState('');
  const [plaza_id,setplaza] = useState('');

//   useEffect(() => {
//   }, []);

useEffect(() => {
    
    //   setName(getname);
    //   setEmail(getemail);
    //   setMobile(getmobile);
    //   setplazaname(getplaza);
    //   setrolename(getrole);
    //   setSelectedOption(getroleid);
    //   setpid(getplazaid);
    //   setactive(getisactive);
    setName(plazaname);
    setAddr(plazaaddress);
    setremi(plazaremitance);
    setplaza(plazaid);
      
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(api + 'updplaza', {
      method: "POST",
      body: JSON.stringify({
        name,
        addr,
        remi,
        plaza_id
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

  return (
    <>
    <div className='fixed top-0 right-[37%]  p-4 w-[250px]'>
    <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
        Plaza Updated
      </Alert>
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Update Plaza
              </Typography>
              <Typography
                className="mb-3 font-normal"
                variant="paragraph"
                color="gray"
              >
                Update Plaza name, address and remitance
              </Typography>
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
                type='number'
              />
              <Typography className="-mb-2" variant="h6">
                Remitance
              </Typography>
              <Input
                label="Remitance"
                size="lg"
                value={remi}
                onChange={(e) => setremi(e.target.value)}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" type="submit" color='green' fullWidth>
                Update
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Dialog>
    </>
  );
}
