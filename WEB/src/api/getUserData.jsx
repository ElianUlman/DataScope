import React from 'react'
import axios from "axios";

const getUserData = async (token) =>{
    try{
      const response = await axios.get("http://localhost:3000/api/userdata", {
      headers: {
        Authorization: token
      }})

      sessionStorage.setItem("username", response.data.name)
      return response.data.name
     
    }catch(error){
      
      return error.response.status
    }
  }

export default getUserData