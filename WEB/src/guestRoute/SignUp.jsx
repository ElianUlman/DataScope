import SignupForm from "./SignupForm"


const SignUp = (props) => {
  return (
    <>
      <SignupForm signUpFunc={props.signUpFunc}/>
    </>
  )
}

export default SignUp