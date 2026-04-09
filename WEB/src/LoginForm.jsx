import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";


const LoginForm = (props) => {
    const navigate = useNavigate();

    const [text, setText] = useState()
    const [passwordText, setPasswordText] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const changeHandler = (e) => {
        switch(e.target.type){

            case "email":
                setText(e.target.value)
            break;

            case "password":
                setPasswordText(e.target.value);
            break;
        }
    }

    const loginResult = async () =>{
        const error = await props.loginFunc(text, passwordText)
        if(error === 401){
            setErrorMessage("incorrect password or username"+text)

        }

        if(!error){
            setErrorMessage()
            navigate("/");
        }
        console.log(error)
        
    }

    

  return (
    <>
        
        <form action="">
            <h3>{errorMessage}</h3>
            <input type="email" onChange={changeHandler} placeholder='email'/>
            <input type="password" onChange={changeHandler} placeholder='password'/>
            <button type='button' onClick={() => loginResult()}>login</button>
        </form>
    </>
  )
}

export default LoginForm