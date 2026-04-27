import SignupForm from "../components/SignupForm"


const SignUp = (props) => {
  return (
    <>
      <SignupForm signUpFunc={props.signUpFunc}/>
    </>
  )
}

export default SignUp