import React from 'react'
import axios from "axios";


const getMyCompanies = async (token) => {
  try{
    const response = await axios.get("http://localhost:3000/api/mycompanies", {
      headers: {
        Authorization: token
    }})
    if(response.data.length<=0){return false}

    sessionStorage.setItem("myCompany/s", response.data)
    return response.data

  }catch (error){
    return false
  }
}

export default getMyCompanies