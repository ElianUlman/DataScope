import axios from "axios";

export const userLogin = async (email, password) => {
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



export const getUserData = async (token) =>{
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

export const getMyCompanies = async (token) => {
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

export const fullSignUp = async (companyName, companyTier, username, email, password) => {
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