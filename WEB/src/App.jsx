import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import './App.css'

import Home from './Home';
import About from './About';
import PageHeader from "./PageHeader"
import SignUp from './SignUp';
import Login from './login';

function App() {

  const [token, setToken]=useState();
  const [username, setusername]=useState();

  const fullSignUp = async (companyName, companyTier, username, email, password) => {
    try{
      const response = await axios.put(
        "http://localhost:3000/api/createCompany",
        {
          "companyName": companyName, 
          "companyTier": companyTier, 
          "username": username, 
          "email": email, 
          "password": password
        }
      )
      console.log("insert OK")
      return await userLogin(email, password)
      
    }catch(error){
      return error.response.status
    }
  }

  const userLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          "email": email, 
          "password": password
        }
      );
      setToken(response.data.token)
      console.log("login OK")

      return await getCompanyData(response.data.token)
      
    } catch (error) {
      return error.response.status
      
    }
  };

  const getCompanyData = async (token) =>{
    try{
      const response = await axios.get("http://localhost:3000/api/userdata", {
      headers: {
        Authorization: token
      }})

      setusername(response.data.name)
      console.log("get OK")
    }catch(error){
      
      return error.response.status
    }
  }


  
  

  return (
    <BrowserRouter>
      < PageHeader name={username}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login loginFunc={userLogin}/>} />
        <Route path="/signup" element={<SignUp signUpFunc={fullSignUp}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
