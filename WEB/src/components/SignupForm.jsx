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
   

    const emailAuth = () => {
        
        if(!/\w+@[a-z]+\.[a-z]+\.?.+/.test(email)){
            setErrorMessage("invalid email")
            return false
        }   
        return true
    }


    const signupResult = async () =>{
        if(!creditCardLuhnAuth()){return}
        if(!emailAuth()){return}
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
        
                <input type="radio" name="tier" value="basic" id="basicTier" onChange={(e) => setTier(e.target.value)}/>
                <label htmlFor="basicTier">Basic</label><br/>
                
                <input type="radio" name="tier" value="standard" id="standardTier" onChange={(e) => setTier(e.target.value)}/>
                <label htmlFor="standardTier">Standard</label><br/>
                
                <input type="radio" name="tier" value="advanced" id="advancedTier" onChange={(e) => setTier(e.target.value)}/>
                <label htmlFor="advancedTier">Advanced</label><br/>
            </fieldset>

            <div>
                <input type="text" placeholder='titular de tarjeta'/>
                <input type="tel" placeholder='numero de tarjeta' id='creditCard' onChange={(e)=>setCreditCardNumber(e.target.value)}/>
                <input type="text" placeholder='año'/>
                <input type="text" placeholder='mes'/>

                <input type="text" placeholder='codigo de seguridad' min={0} max={999}/>

            </div>


            
            <input type="text" placeholder='company name' onChange={(e)=>setCompanyName(e.target.value)}/>
            <input type="text" placeholder='admin username' onChange={(e)=>setUserName(e.target.value)}/>
            <input type="email" placeholder='admin email' onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder='admin password' onChange={(e)=>setPassword(e.target.value)}/>
            <button type='button' onClick={()=> signupResult()}>sign up</button>
        </form>
    </>
  )
}

export default SignupForm





/*  (i did this for fun, it isnt imp)
    const creditCardLuhnAuth = () =>{
        //this uses the luhn algorithm, which only checks if the credit card might be valid (aka, numbers are Ok)
        try{
            const noSpaces = creditCardNumber.replaceAll(/\s|-/g, "")
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
*/