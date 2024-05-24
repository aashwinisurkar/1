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
 
export default function Changepass({uid}) {
  const [open, setOpen] = React.useState(true);
  const [open1, setOpen1] = useState(false);
  const [open2,setOpen2] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
//   const [name, setName] = useState(plazaname);
//   const [addr, setAddr] = useState(plazaaddress);
//   const [remi, setremi] = useState(plazaremitance);
//   const [opn, setopening] = useState(plazaopn);
//   const [valid_from,setfrom] = useState(plazavalidf);
//   const [valid_to,setto] = useState(plazavalidt);
//   const [plaza_id,setid ] = useState(plazaid);
//   const [uid,setuid] = useState(userid);
const [id2,setid2] = useState(uid);
const [pass,setpass] = useState('');
const [pass1,setpass1] = useState('');
const [newpass,setnewpass] = useState('');
const [confirmPasswordClicked,setConfirmPasswordClicked] = useState(false);

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
    if(pass1 === '' || newpass ==='' || pass ===''){
      alert("Enter all details");
    }else{
        if(pass1 === newpass ){
    fetch(api + 'cpass', {
      method: "POST",
      body: JSON.stringify({
        id2,
        pass,
        newpass
      })
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if(data.ResponseCode==200){
        setOpen1(true);
        setOpen(false);
    }else{
        setOpen2(true);
        setOpen(false);
    }
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
    }else{
        alert("Password not matched");
    }
    }
  }

  return (
    <>
    <div className='fixed top-0 right-[37%]  p-4 w-[250px]'>
    <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
        Password Changed
      </Alert>
      <Alert color="red" open={open2} onClose={() => setOpen2(false)}>
        Old Password Incorrect 
      </Alert>
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent  shadow-none"
      >
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto w-full max-w-[24rem] h-[440px]">
            <CardBody className="flex flex-col gap-2">
              <Typography variant="h4" color="blue-gray">
                Change Password
              </Typography>
              <Typography
                className="mb-1 font-normal"
                variant="paragraph"
                color="gray"
              >
                Enter New Password
              </Typography>
              <div className='flex flex-wrap'>
              <Typography className="mb-2" variant="h6">
                Current Password
              </Typography>
              <Input
                label="Current Password"
                size="lg"
                value={pass}
                onChange={(e) => setpass(e.target.value)}
                className='mb-2'
                type='password'
              />
              <Typography className="mb-2" variant="h6">
                New Password
              </Typography>
              <Input
                label="New Password"
                size="lg"
                value={newpass}
                onChange={(e) => setnewpass(e.target.value)}
                className='mb-1'
                type='password'
              />
              <Typography className="mb-2" variant="h6">
                Confirm New Password
              </Typography>
              <Input
                label="Confirm New Password"
                size="lg"
                value={pass1}
                onChange={(e) => {
                    setpass1(e.target.value);
                    setConfirmPasswordClicked(true);
                }}
                type='password'
                // className={`mb-1 ${pass1 !== newpass ? 'border-[3px] border-red-500' : ''}`}
                className='mb-1'
              />
                {confirmPasswordClicked && pass1 !== newpass && (
                    <Typography variant="caption" color="red" className="mt-1">
                        Passwords do not match
                    </Typography>
                )}
              </div>
            </CardBody>
            <CardFooter className="pt-0 -mb-2">
              <Button variant="gradient" type="submit" 
              disabled={pass1 !== newpass }
              fullWidth>
                Change Password
              </Button>
            </CardFooter>
          </Card>
          
        </form>
      </Dialog>
    </>
  );
}
