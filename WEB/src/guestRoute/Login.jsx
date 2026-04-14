import LoginForm from "./LoginForm"



const Login = (props) => {

    

  return (
    <>
        < LoginForm loginFunc={props.loginFunc}/>
    </>
  )
}

export default Login