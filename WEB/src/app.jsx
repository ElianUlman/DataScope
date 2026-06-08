import LandingPage from './pages/LandingPage'
import Perfil from './pages/Perfil'
import About from './pages/About.jsx';
import Header from './layouts/Header.jsx'
import Footer from './layouts/Footer.jsx'
import Overview from './pages/Overview.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



export default function App() {

  return <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </BrowserRouter>
    <Footer />
  </>
}