import { Routes, Route, Navigate,BrowserRouter as Router, } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import HomePage from "./Homepage";
import React,{useEffect} from "react";
import { Home, Profile , Tables , Notifications } from '@/pages/dashboard';
import { useState } from "react";
import CryptoJS from "crypto-js";
import api from "./ApiLink.mjs";
import Demoencry from '@/Demoencry';
// import "./App.css";

function App() {

  return (
    // <Router>
    <Routes>
      <Route path="*" element={<HomePage />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/operator/*" element={<Dashboard />} />
      <Route path="/reports/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="home" element={<Home />} />
      <Route path = '/encry' element = {<Demoencry/>} />
    </Routes>
    // </Router>
    
  );
}

export default App;
