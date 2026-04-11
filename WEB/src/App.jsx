import { useState } from 'react'
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import axios from "axios";
import './App.css'

import Home from './Home';
import About from './About';
import PageHeader from "./PageHeader"
import SignUp from './SignUp';
import Login from './login';

function App() {
  
  
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

      sessionStorage.setItem("token", response.data.token); //esto se guarda hasta que se cierre la ventana
      
      

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
      sessionStorage.setItem("username", response.data.name)
      setusername(response.data.name)
     
    }catch(error){
      
      return error.response.status
    }
  }

  const GuestRoute = ({ user, children }) => {
    
  if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  }


  
  

  return (
    <BrowserRouter>
      < PageHeader name={sessionStorage.getItem("username")}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <GuestRoute user={sessionStorage.getItem("token")}>
              <Login loginFunc={userLogin} />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute user={sessionStorage.getItem("token")}>
              <SignUp signUpFunc={fullSignUp} />
            </GuestRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
