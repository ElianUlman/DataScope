import React, {useState} from 'react'

const LoginForm = (props) => {
    
    const [text, setText] = useState()
    const [passwordText, setPasswordText] = useState()

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

    //props.loginFunc(text, passwordText)

  return (
    <>
        <p>text is {text} and pass is {passwordText}</p>
        <form action="">
            <input type="text" onChange={changeHandler}/>
            <input type="password" onChange={changeHandler}/>
            <button type='button' onClick={() => props.loginFunc(text, passwordText)}>login</button>
        </form>
    </>
  )
}

export default LoginForm