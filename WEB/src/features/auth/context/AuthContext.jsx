import { createContext, useState, useContext, useEffect } from "react"
import { userLogin, userSignup, getUserData } from "../services/apiAuth"

const AuthContext = createContext()

function setCookie(name, value, days) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLogged, setIsLogged] = useState(false);


    useEffect(() => {

        async function getTokenData() {

            const token = sessionStorage.getItem("token") || localStorage.getItem("token") || getCookie("datascope_token")
            
            try {

                if (token) {
                    const response = await getUserData(token)
                    setUser(response.data.user)
                    setIsLogged(true)
                }

            } catch (error) {
                
                logout();
            }

        }

        getTokenData()

    }, [])

    const login = async (email, password, isPersistant) => {
        try {
            const response = await userLogin(email, password)
            console.log(response.data)
            setUser(response.data.user)
            if (isPersistant) {
                localStorage.setItem("token", response.data.token)
                setCookie("datascope_token", response.data.token, 30)
            } else {
                sessionStorage.setItem("token", response.data.token)
                setCookie("datascope_token", response.data.token, 1) // 1 día
            }

            setIsLogged(true)

            return true
        } catch (error) {
            console.log("error: "+error)
            return false
        }
    }

    const signup = async (name, email, password, isPersistant) => {
        try {
            const response = await userSignup(name, email, password)
            console.log(response.data)
            setUser(response.data.user)
            if (isPersistant) {
                localStorage.setItem("token", response.data.token)
                setCookie("datascope_token", response.data.token, 30)
            } else {
                sessionStorage.setItem("token", response.data.token)
                setCookie("datascope_token", response.data.token, 1)
            }
            setIsLogged(true)

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        deleteCookie("datascope_token")
        setUser(null)
        setIsLogged(false)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLogged,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    return useContext(AuthContext)
}