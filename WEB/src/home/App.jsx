import { useState } from 'react'
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import './App.css'

import Home from './Home';
import About from '../guestRoute/About';
import PageHeader from "../PageHeader"
import SignUp from '../guestRoute/SignUp';
import Login from '../guestRoute/Login';
import {userLogin, getUserData, getMyCompanies, fullSignUp} from '../api/userSessionManager'

import DisplayCompany from '../userRoute/displayCompany';

function App() {
  
  const[username, setUsername] = useState()
  const[myCompanies, setmyCompanies] = useState()

  const companySignUp = async (companyName, companyTier, username, email, password) =>{
    if(await fullSignUp(companyName, companyTier, username, email, password) === true){
      login(email, password)
    }
  }

  const login = async (email, password) =>{
    if((await userLogin(email, password)) === true){
      setUsername(await getUserData(sessionStorage.getItem("token")))
      setmyCompanies(await getMyCompanies(sessionStorage.getItem("token")))
    }
  }

  const GuestRoute = ({ user, children }) => {
    if (user) {
        return <Navigate to="/" replace />;
      }
      return children;
  }

  const UserRoute = ({user, children}) => {
    if(!user){
      return <Navigate to="/" replace />;
    }
    return children
  }
  
  

  return (
    <BrowserRouter>
      < PageHeader name={sessionStorage.getItem("username")} myCompanies={sessionStorage.getItem("myCompany/s")}/>
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
        <Route
          path="/company"
          element={
            <UserRoute user={sessionStorage.getItem("token")}>
              <DisplayCompany />
            </UserRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
