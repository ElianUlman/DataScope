import { createContext, useState, useContext, useEffect } from "react"
import { userLogin, userSignup, getUserData } from "../services/apiAuth"

const AuthContext = createContext()

function setCookie(name, value, days) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`
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

    const logout = () => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")

        // Solo borramos la cookie si existe, para no disparar eventos en cadena
        const cookieExists = getCookie("datascope_token")
        if (cookieExists) deleteCookie("datascope_token")

        setUser(null)
        setIsLogged(false)
    }

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

        const syncAuthState = async () => {
            const currentCookie = getCookie("datascope_token");
            const localToken = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!currentCookie && localToken) {
                console.log("[Sync] Cookie eliminada desde la extensión. Cerrando sesión en la web...");
                logout();
            }
            else if (currentCookie && !localToken) {
                console.log("[Sync] Nueva cookie detectada desde la extensión. Iniciando sesión...");
                try {
                    const response = await getUserData(currentCookie);
                    setUser(response.data.user || response.data);
                    setIsLogged(true);
                    sessionStorage.setItem("token", currentCookie);
                } catch (error) {
                    logout();
                }
            }
        }

        const interval = setInterval(syncAuthState, 1000);
        window.addEventListener("focus", syncAuthState);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", syncAuthState);
        };

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

            try {
                console.log("[Web] Intentando avisar a la extensión...")
                window.postMessage({ type: "WEB_LOGIN", token: response.data.token }, "*")
                console.log("[Web] Mensaje enviado")
            } catch (e) {
                console.log("[Web] Error:", e.message)
            }

            return true
        } catch (error) {

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