import { Link } from "react-router-dom";
import './PageHeader.css'


function PageHeader(props){
    let content
    if(props.name !== undefined){
        content = <h3>{props.name}</h3>
    }

    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                
                <Link to="/about">About</Link>


            </nav>

            <div>
               <Link to="/Login">Login</Link> 
               <Link to="/signup">Sign up</Link>
            </div>

            {content}
            
        </header>

    )
}

export default PageHeader 