import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import api from './ApiLink.mjs';
import { Password } from '@mui/icons-material';
import "./Style.css";


const encryptAndStoreData = (data, key) => {
  localStorage.clear();
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  localStorage.setItem('encryptedData', encryptedData);
};
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^.{8,}$/;
  return passwordRegex.test(password);
};

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);


  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // const [isValidPassword, setIsValidPassword] = useState(false); 
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');



  const [loggedIn, setLoggedIn] = useState(false);
 
  
 
  const [responseData, setResponseData] = useState({});
  // const[inputTouched, setInputTouched]  = useState(false)
  const linkRef = useRef(null);
  const navigate = useNavigate();




  
const handleEmailFocus = () => {
  setEmailTouched(true);
  if (!email) {
    setEmailError('Please enter your email');
  }
};
 const handleEmailChange = (e) => {
  setEmail(e.target.value);
  setEmailError('');
};
const handleEmailBlur = () => {
  if (email && !emailError) {
    setEmailError('');
  }
};
const handlePasswordFocus = () => {
  setPasswordTouched(true);
  if (!password) {
    setPasswordError('Please enter your password');
  }
};

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
  setPasswordError('');
};

const handlePasswordBlur = () => {
  if (password && !passwordError) {
    setPasswordError('');
  }
};

  const handlSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    if (!validateEmail(email)) {
      setEmailError('Invalid email');
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }





try {
  const res = await fetch(`${api}login`, {
    method: 'POST',
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const responseData = await res.json();
    if (responseData.ResponseCode === '200') {
      setLoggedIn(true);
      setResponseData(responseData);
      encryptAndStoreData(responseData, 'Harry');
      linkRef.current.click();
    } else {
      handleApiError(responseData);
    }
  } else {
    setErrorMessage('Invalid email or password');
  }
} catch (err) {
  setErrorMessage('An error occurred. Please try again.');
}
};

const handleApiError = (responseData) => {
const { ResponseMessage } = responseData;

if (ResponseMessage.includes('Invalid email') && ResponseMessage.includes('Invalid password')) {
  setEmailError('Invalid email');
  setPasswordError('Invalid password');
} else if (ResponseMessage.includes('Invalid email')) {
  setEmailError('Invalid email');
} else if (ResponseMessage.includes('Invalid password')) {
  setPasswordError('Invalid password');
}
};

  let dynamicPath = "";
  if (loggedIn) {
    switch (responseData.user.role) {
      case "Admin":
        dynamicPath = "/dashboard/home";
        break;
      case "Toll Operator":
        dynamicPath = "/operator/ophome";
        break;
      default:
        if (responseData.user.rid === "2") {
          dynamicPath = "/reports/report/plazarep";
        }
        break;
    }
  }

  return (
    // <div className="h-screen bg-cover bg-gradient-to-br from-red-200 via-purple-300 to-yellow-200 animate-color">
       <div className="h-screen ">
      
      <div className="flex min-h-full flex-1 flex-col justify-center px-5 py-6 lg:px-6  ">
        
      <div class="lg:w-1/4 md:w-2/3 mx-auto bg-white border-2 border-purple-800 shadow-custom rounded-lg z-9 relative ">
          <div className="card shadow-inner   z-index-0 ">
            <div className="bg-purple-500 mb-lg py-3 from-primary to-transparent shadow-primary rounded-lg  card-header z-index-3 position-relative shadow-inner hadow-brown">
              <img
                className="mx-auto h-[55px] w-auto bg-none image-style "
                src="https://media.istockphoto.com/id/1276720040/vector/a-letter-with-road-way-asphalt-logo.jpg?s=612x612&w=0&k=20&c=-M1A6a05rC-AYnUklvd0G7ivAdmofZ5fXW__j8nvDGk="
                alt="Your Company"
            
              />
              <h2 className="mt-5 text-center text-3xl font-bold leading-9 tracking-tight text-white">
                Sign in
              </h2>
            </div>
          </div>
          <div className="card-body w-full bg-white px-7 border-none py-10">
          {(errorMessage ) && (<div className="text-red-500 text-center text-lg mb-4">
          {errorMessage }</div>)
            }
            <form className="space-y-6" onSubmit={handlSubmit} autoComplete="off">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-8 text-gray-900">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                    ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    // onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleEmailFocus}
                    onBlur={handleEmailBlur}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <div className="text-red-500 text-sm mt-1">
                      {emailError}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     onFocus={handlePasswordFocus}
                     onBlur={handlePasswordBlur}
                     onChange={handlePasswordChange}
                  />
                  {passwordError && (
                    <div className="text-red-500 text-sm mt-1">
                      {passwordError}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ display: 'none' }}>
                  <Link to={dynamicPath} ref={linkRef} />
                </div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-purple-600 w-100 py-3 text-sm font-semibold leading-5 text-white
                   shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
