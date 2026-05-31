import LandingPage from './pages/LandingPage'
import About from './pages/About.jsx';
import Header from './layouts/Header.jsx'
import Footer from './layouts/Footer.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';



export default function App() {
  return <>
    <Header />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
    

    <Footer />
  </>
}