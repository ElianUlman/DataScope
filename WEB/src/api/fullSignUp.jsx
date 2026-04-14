import React from 'react'
import axios from "axios";

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
     
      return true
      
    }catch(error){
      return error.response.status
    }
  }

export default fullSignUp