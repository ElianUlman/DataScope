import { createContext, useState, useContext, useEffect } from "react"
import { userLogin, userSignup, getUserData } from "../services/apiAuth"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLogged, setIsLogged] = useState(false);


    useEffect(() => {

        async function getTokenData() {

            const token = sessionStorage.getItem("token") || localStorage.getItem("token")

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

            setUser(response.data.user)
            if (isPersistant) {
                localStorage.setItem("token", response.data.token)
            } else {
                sessionStorage.setItem("token", response.data.token)
            }

            setIsLogged(true)

            return true
        } catch (error) {

            return false
        }
    }

    const signup = async (name, email, password, isPersistant) => {
        try {
            const response = await userSignup(name, email, password)

            setUser(response.data.user)
            if (isPersistant) {
                localStorage.setItem("token", response.data.token)
            } else {
                sessionStorage.setItem("token", response.data.token)
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