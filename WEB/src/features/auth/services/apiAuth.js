import axiosClient from "../../../services/axiosClient";

export const userLogin = async (email, password) => {
    try {
        const response = await axiosClient.post(
            "/login",
            {
                "email": email,
                "password": password
            }
        );
        console.log(response)
        return response.data

    } catch (error) {
        return error.response.status

    }
};

export const userSignup = async (name, email, password) => {
    try {
        const response = await axiosClient.put(
            "/user",
            {
                "email": email,
                "password": password,
                "name": name
            }
        );

        return response.data

    } catch (error) {
        return error.response.status

    }
};

export const getUserData = async (token) =>{
    try{
      const response = await axiosClient.get("/userdata", {
      headers: {
        Authorization: token
      }})

      return response.data
     
    }catch(error){
      
      return error.response.status
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
        return error.response.status
    }
}
