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
  const [companyName, setCompanyName]=useState();


  const loginCompany = async (companyName, companyPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/loginCompany",
        {
          companyName: companyName,
          companyPassword: companyPassword
        }
      );
      setToken(response)
      getCompanyData(response.data.token)
    } catch (error) {
      console.error(error);
    }
  };

  const getCompanyData = async (token) =>{
    try{
      const response = await axios.get("http://localhost:3000/companyToken", {
      headers: {
        Authorization: token
      }})

      setCompanyName(response.data.name)

    }catch(error){
      console.error(error);
    }
  }

  

  return (
    <BrowserRouter>
      < PageHeader name={companyName}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login loginFunc={loginCompany}/>} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
