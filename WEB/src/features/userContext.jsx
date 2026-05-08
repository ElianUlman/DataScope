import { createContext, useState, useContext } from 'react';
import { getUserData } from '../api/userSessionManager';

export const UserContext = createContext(null);

export async function UserProvider({ children }) {
    const [username, setUsername] = useState(await getUserData(sessionStorage.getItem("token")));
    const [company, setCompany] = useState(await getMyCompanies(sessionStorage.getItem("token")))
  

  return (
    <UserContext.Provider value={{ username, company }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);