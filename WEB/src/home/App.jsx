import { useState } from 'react'
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import axios from "axios";
import './App.css'

import Home from './Home';
import About from '../guestRoute/About';
import PageHeader from "../PageHeader"
import SignUp from '../guestRoute/SignUp';
import Login from '../guestRoute/Login';
import userLogin from '../api/userLogin';
import getUserData from '../api/getUserData';
import fullSignUp from '../api/fullSignUp';

function App() {
  
  const[username, setUsername] = useState()

  const companySignUp = async (companyName, companyTier, username, email, password) =>{
    
    if(await fullSignUp(companyName, companyTier, username, email, password) === true){
      
      login(email, password)
    }
    
  }

  const login = async (email, password) =>{
    
    
    if((await userLogin(email, password)) === true){
      
      setUsername(await getUserData(sessionStorage.getItem("token")))
      
    }
  }

  const GuestRoute = ({ user, children }) => {
    if (user) {
        return <Navigate to="/" replace />;
      }
      return children;
  }

  const userRoute = ({user, children}) => {
    if(!user){
      return <Navigate to="/" replace />;
    }
    return children
  }
  
  

  return (
    <BrowserRouter>
      < PageHeader name={username || sessionStorage.getItem("username")}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <GuestRoute user={sessionStorage.getItem("token")}>
              <Login loginFunc={login} />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute user={sessionStorage.getItem("token")}>
              <SignUp signUpFunc={companySignUp} />
            </GuestRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
