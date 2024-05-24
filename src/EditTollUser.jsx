import React, { useEffect, useState } from 'react'
import {
    Drawer,
    Typography,
    IconButton,
  } from "@material-tailwind/react";
  
  import { Alert } from "@material-tailwind/react";
import api from './ApiLink.mjs';

export default function EditTollUser({getname,getmobile,getemail,getrole,getroleid,getplaza,getplazaid,getisactive,getid}) {
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(true);
  const [erropen1, seterrOpen1] = useState(false);
  const [erropen, seterrOpen] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pid,setpid] = useState('');
  const [role, setSelectedOption] = useState('');
  const [options,setoptions] = useState([]);
  const [plaza,setplaza] = useState([]);
  const [rolename,setrolename] = useState('');
  const [plazaname,setplazaname]=useState('');
  const [active,setactive]=useState('');
 
//   const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    // Fetch options data from your API here
    fetch(api+'get_role')
      .then((response) => response.json())
      .then((data) => {
        // setOptions(data); // Set the fetched data to the options state
        // console.log(data.data);
        setoptions(data.data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
      fetch(api+'get_plaza')
      .then((response) => response.json())
      .then((data) => {
        // setOptions(data); // Set the fetched data to the options state
        // console.log(data.data);
        // setoptions(data.data);
        setplaza(data);
        // console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching options:', error);
      });
      setName(getname);
      setEmail(getemail);
      setMobile(getmobile);
      setplazaname(getplaza);
      setrolename(getrole);
      setSelectedOption(getroleid);
      setpid(getplazaid);
      setactive(getisactive);
      
  }, []);

  const validateMobileNumber = (number) => {
    const regex = /^[7896]\d{9}$/;
    return regex.test(number);
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log('Name:', name);
    // console.log('Password:', password);
    // console.log('Email:', email);
    // console.log('Mobile:', mobile);
    // console.log('Selected Option:', role);
    // console.log('Plaza',pid);
    // console.log("ID: ",getid);
    if(name === '' || email===''||role===''||mobile===''|| pid ===''){
      console.log("Edit info");
    }else{
      if(validateMobileNumber(mobile)){
        // && validateEmail(email)
    try {
        const response = await fetch(api+'manage_user/update', {
          method: "POST",
          
          body: JSON.stringify({
            name,
            email,
            mobile,
            role,
            pid,
            getid,
            active,
            password,
          })
        
        });

        
        
        const data = await response.json();
    const { ResponseCode } = data; 
    console.log(ResponseCode);

    if (ResponseCode === "200") {
      console.log('Data sent successfully');
      setOpen(false);
      setOpen1(true);
    } else {
      if (ResponseCode === "402") {
        console.log("Nhi Hua add");
        setOpen(false);
        seterrOpen1(true);
      }

      console.error('Error sending data:', data);
    }
      } catch (error) {
        console.error('Error sending data:', error);
        
      }
    }else{
      alert("invalid email or number");
    }
    }

  };


  return (
    <>
    <React.Fragment>
      <div className='fixed top-0 right-[37%]  p-4 w-[250px]'>
    <Alert color="green" open={open1} onClose={() => setOpen1(false)}>
        User Updated
      </Alert>
      <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
        Updation Failed
      </Alert>
      </div>
      {/* <Button onClick={openDrawer}>Open Drawer</Button> */}
      <Drawer open={open} onClose={closeDrawer} className="p-4" placement="right">
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Update User
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-normal">
        <div className="max-w-md mx-auto mt-0 p-1">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            value = {name}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-gray-700">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
             value={getmobile}
            // onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 cursor-no-drop"
            disabled
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            // type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            // disabled
          />
        </div>
        <div>
          <label htmlFor="option" className="block text-gray-700">Role</label>
          <select
            id="option"
            name="option"
            // value={getrole}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value={role} >{rolename}</option>
            {options.map((option) => (
              <option  value={option.id}>
                {option.roll_name}
              </option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="option" className="block text-gray-700">Assign Plaza</label>
        <select
            id="option1"
            name="option"
            // value={plazaname}
            onChange={(e) => setpid(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value={pid} >{plazaname}</option>
            {plaza.map((option) => (
              <option  value={option.plaza_id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
        <label htmlFor="option" className="block text-gray-700">Status</label>
        <select
            id="option2"
            name="option"
            // value={active}
            onChange={(e) => setactive(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value='1' >Active</option>
            <option value='0' >InActive</option>
          </select>
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={(e) =>setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Update User
          </button>
        </div>

          </form>
          </div>
        </Typography>
        
      </Drawer>
    </React.Fragment>
    </>
  )
}
