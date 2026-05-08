import { useNavigate } from "react-router-dom";
import {logOut} from '../api/userSessionManager'

const settings = () =>{
  const navigate = useNavigate()

  const triggerLogout = () => {
    logOut()
    navigate("/settings")
  }

return (
    <div>
      <h3>settings</h3>
      <button onClick={()=> triggerLogout()}>log out</button>
    </div>
  )
}

export default settings