import React, { useEffect, useState } from 'react'
import {
    Drawer,
    Typography,
    IconButton,
  } from "@material-tailwind/react";
  
  import { Alert } from "@material-tailwind/react";
import api from './ApiLink.mjs';

export default function AddTollUser({user_id_}) {
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
    const [uid,setuid] = useState(user_id_);
 
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

  const checkrole = (value) =>{
    setSelectedOption(value);
    // console.log(value);
    if(value == 2 || value == 4){
      // console.log(plaza);
      // plaza.push({ plaza_id: '23', name: 'All Plaza' });
      // setplaza([...plaza, { plaza_id: '23', name: 'All Plaza' }]);

      const isNewPlazaPresent = plaza.some(option => option.plaza_id === '23');

      // Add the new plaza option if it doesn't already exist in the list
      if (!isNewPlazaPresent) {
        setplaza([...plaza, { plaza_id: '23', name: 'All Plaza' }]);
      }

    }else{
      setplaza(plaza.filter(option => option.plaza_id !== '23'));
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log('Name:', name);
    // console.log('Password:', password);
    // console.log('Email:', email);
    // console.log('Mobile:', mobile);
    // console.log('Selected Option:', role);
    if(name === '' || password ===''|| email===''||role===''||mobile===''|| pid ===''){
      alert("Enter all Fields");
    }else{
      if(validateMobileNumber(mobile) && validateEmail(email)){
    try {
        const response = await fetch(api+'manage_user/add', {
          method: "POST",
          
          body: JSON.stringify({
            name,
            password,
            email,
            mobile,
            role,
            pid,
            uid
          })
        
        });

        
        
        const data = await response.json();
    const { ResponseCode } = data; 

    if (ResponseCode === "200") {
      // Request was successful
      console.log('Data sent successfully');
      // closeDrawer; // You may want to uncomment this line if it's intended to close a drawer
      // alert("user added");
      // console.log(response.ResponseCode);
      setOpen(false);
      setOpen1(true);
    } else {
      // Handle error response here
      if (ResponseCode === "402") {
        console.log("Nhi Hua add");
        setOpen(false);
        seterrOpen1(true);
      }

      console.error('Error sending data:', data);
    }
      } catch (error) {
        // Handle network or other errors here
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
        User Added
      </Alert>
      <Alert color="red" open={erropen1} onClose={() => seterrOpen1(false)}>
        Duplicate Entry of Mobile or email
      </Alert>
      </div>
      {/* <Button onClick={openDrawer}>Open Drawer</Button> */}
      <Drawer open={open} onClose={closeDrawer} className="p-4" placement="right">
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Add User
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
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-gray-700">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="option" className="block text-gray-700">Role</label>
          <select
            id="option"
            name="option"
            onChange={(e) => checkrole(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Role</option>
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
            onChange={(e) => setpid(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="" >Select Plaza</option>
            {plaza.map((option) => (
              <option  value={option.plaza_id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            // value="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Add User
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
