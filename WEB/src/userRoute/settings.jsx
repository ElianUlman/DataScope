

const settings = ({logOut}) =>{
return (
    <div>
      <h3>settings</h3>
      <button onClick={()=> logOut()}>log out</button>
    </div>
  )
}

export default settings