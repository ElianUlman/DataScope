import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

const SignupForm = (props) => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("valid credit card n: 4539148803436467")

    const [creditCardNumber, setCreditCardNumber]=useState("1");
    const [tier, setTier ] = useState()
    const [companyName, setCompanyName]=useState()
    
    const [userName, setUserName]=useState()
    const [email, setEmail]=useState()
    const [password, setPassword]=useState()
   
  
    const creditCardLuhnAuth = () =>{
        //this uses the luhn algorithm, which only checks if the credit card might be valid (aka, numbers are Ok)
        try{
            const noSpaces = creditCardNumber.replaceAll(" ", "")
            let digits = Array.from(String(noSpaces), Number)

            let isSecond = false;
            let sum = 0

            for(let i=digits.length-1; i>=0; i--){
                if(isSecond){
                    digits[i] = digits[i]*2

                    if(digits[i] > 9){
                        digits[i]=digits[i]-9;
                    }

                    isSecond=false;
                }else{
                    isSecond=true;
                }
                sum+=digits[i]
            }

            if(sum % 10 === 0 && digits.length > 10 && digits.length < 20){
                
                return true
            }else{
                setErrorMessage("invalid credit card")
                return false
            }

        }catch{
            setErrorMessage("invalid credit card")
        }
    }

    const changeHandler = (e)=>{
        switch(e.target.id){
            case "creditCard":
                setCreditCardNumber(e.target.value)
                break;

            case "basicTier":
            case "standardTier":
            case "advancedTier":
                setTier(e.target.value)
                break;

            case 'companyName':
                setCompanyName(e.target.value)
                break;

            case 'adminName':
                setUserName(e.target.value)
                break;

            case 'email':
                setEmail(e.target.value)
                break;

            case 'password':
                setPassword(e.target.value)
                break;
            
        }

       
    }

    const signupResult = async () =>{
        if(!creditCardLuhnAuth()){return}

        const error = await props.signUpFunc(companyName, tier, userName, email, password)
        

        if(!error){
            setErrorMessage()
            navigate("/");
        }
        setErrorMessage(error)
        console.log(error)
        
    }

    return (
    <>
        <form action="">
            <h3>{errorMessage}</h3>

            <fieldset>
                <legend>Select a tier:</legend>
        
                <input type="radio" name="tier" value="basic" id="basicTier" onChange={changeHandler}/>
                <label htmlFor="basicTier">Basic</label><br/>
                
                <input type="radio" name="tier" value="standard" id="standardTier" onChange={changeHandler}/>
                <label htmlFor="standardTier">Standard</label><br/>
                
                <input type="radio" name="tier" value="advanced" id="advancedTier" onChange={changeHandler}/>
                <label htmlFor="advancedTier">Advanced</label><br/>
            </fieldset>

            <div>
                <input type="text" placeholder='titular de tarjeta'/>
                <input type="tel" placeholder='numero de tarjeta' id='creditCard' onChange={changeHandler}/>
                <input type="text" placeholder='año'/>
                <input type="text" placeholder='mes'/>

                <input type="text" placeholder='codigo de seguridad' min={0} max={999}/>

            </div>


            
            <input type="text" placeholder='company name' onChange={changeHandler} id='companyName'/>
            <input type="text" placeholder='admin username' onChange={changeHandler} id='adminName'/>
            <input type="email" placeholder='admin email' onChange={changeHandler} id='email'/>
            <input type="password" placeholder='admin password' onChange={changeHandler} id='password'/>
            <button type='button' onClick={()=> signupResult()}>sign up</button>
        </form>
    </>
  )
}

export default SignupForm