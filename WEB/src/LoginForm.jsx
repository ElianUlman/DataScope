import React, {useState} from 'react'

const LoginForm = (props) => {
    
    const [text, setText] = useState()
    const [passwordText, setPasswordText] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const changeHandler = (e) => {
        switch(e.target.type){

            case "text":
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
            setErrorMessage("incorrect password or username")
        }

        if(!error){
            setErrorMessage()
        }
        
    }

    

  return (
    <>
        
        <form action="">
            <h3>{errorMessage}</h3>
            <input type="text" onChange={changeHandler}/>
            <input type="password" onChange={changeHandler}/>
            <button type='button' onClick={() => loginResult()}>login</button>
        </form>
    </>
  )
}

export default LoginForm