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

      getCompanyData(token)
      
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
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
