import React from 'react'
import axios from "axios";

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
      
      return true
      
    } catch (error) {
      return error.response.status
      
    }
  };

export default userLogin