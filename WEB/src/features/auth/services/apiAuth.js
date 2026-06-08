import axiosClient from "../../axiosClient.js";

export const userLogin = async (email, password) => {
    try {
        const response = await axiosClient.post(
            "/login",
            {
                "email": email,
                "password": password
            }
        );
        
        return response

    } catch (error) {
        throw error

    }
};

export const userSignup = async (name, email, password) => {
    try {
        const response = await axiosClient.put(
            "/user",
            {
                "name": name,
                "email": email,
                "password": password
                
            }
        );

        return response

    } catch (error) {
        throw error

    }
};

export const getUserData = async (token) =>{
    try{
      const response = await axiosClient.get("/userdata", {
      headers: {
        Authorization: token
      }})

      return response
     
    }catch(error){
      
      throw error
    }
  }

export const fullSignUp = async (companyName, companyTier, username, email, password) => {
    try {
        const response = await axiosClient.put(
            "/createCompany",
            {
                "companyName": companyName,
                "companyTier": companyTier,
                "username": username,
                "email": email,
                "password": password
            }
        )

        return true

    } catch (error) {
        throw error
    }
}
