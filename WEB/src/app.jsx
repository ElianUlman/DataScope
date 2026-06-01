import LandingPage from './pages/LandingPage'
import Perfil from './pages/Perfil'
import Header from './layouts/Header'
import Footer from './layouts/Footer'


export default function App() {

  const [view, setView] = useState("LandingPage")

  return <>
    <Header />
      {LandingPage === "LandingPage" && <LandingPage />}
      {LandingPage === "Perfil" && <Perfil setView={setView}/>}
    <Footer />
  </>
}