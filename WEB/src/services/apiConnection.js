import axiosClient from "./axiosClient";

function setCookie(name, value, days) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export const userLogin = async (email, password) => {
  try {
    const response = await axiosClient.post(
      "/login",
      {
        "email": email,
        "password": password
      }
    );

    sessionStorage.setItem("token", response.data.token); //esto se guarda hasta que se cierre la ventana
    setCookie("datascope_token", response.data.token, 1);

    return true

  } catch (error) {
    return error.response.status

  }
};



export const getUserData = async (token) => {
  try {
    const response = await axiosClient.get("/userdata", {
      headers: {
        Authorization: token
      }
    })

    sessionStorage.setItem("username", response.data.name)
    return response.data.name

  } catch (error) {

    return error.response.status
  }
}

export const getMyCompanies = async (token) => {
  try {
    const response = await axiosClient.get("/mycompanies", {
      headers: {
        Authorization: token
      }
    })
    if (response.data.length <= 0) { return false }

    sessionStorage.setItem("myCompany/s", response.data)
    return response.data

  } catch (error) {
    return false
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

export const logOut = () => {
  sessionStorage.clear();
  deleteCookie("datascope_token");
}