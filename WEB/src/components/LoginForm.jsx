import React, {useState} from 'react'

const LoginForm = (props) => {

    const [text, setText] = useState()
    const [passwordText, setPasswordText] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const loginResult = async () =>{
        const error = await props.loginFunc(text, passwordText)
        if(error === 401){
            setErrorMessage("incorrect password or username"+text)
        }

        if(!error){
            setErrorMessage()

        }
    }

  return (
    <>
        <form action="">
            <h3>{errorMessage}</h3>
            <input type="email" onChange={(e)=>setText(e.target.value)} placeholder='email'/>
            <input type="password" onChange={(e)=>setPasswordText(e.target.value)} placeholder='password'/>
            <button type='button' onClick={() => loginResult()}>login</button>
        </form>
    </>
  )
}

export default LoginForm