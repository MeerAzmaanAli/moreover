import './homePage.css'
import Footer from "../components/Footer";
import Header from "../components/Header";
import Section from "../components/Section";
import hero from "../media/8.jpg";
import { useEffect, useState } from 'react';
import { getAllProducts } from '../utils/productServices';
const HomePage = () => {
  const sections = [{id:1, title: "Linen Shirts"}, {id:2, title: "Oversized Tees"}, {id:3, title: "Polo Tees"}];
  const [shirts, setShirts] = useState([]);
  const [oversizedTees, setOversizedTees] = useState([]);
  const [poloTees, setPoloTees] = useState([]); 

  useEffect(() => {
    // Fetch products from API or perform any side effects here
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setShirts(products.filter(product => product.categories.includes("LinenShirts")));
        setOversizedTees(products.filter(product => product.categories.includes("OversizedTees")));
        setPoloTees(products.filter(product => product.categories.includes("PoloTees")));

        
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    
  }, []);

  return (
    <div className="homepage-container">
      <div>
        <Header />
      </div>
      <div className="homepage-content">
        <div className="hero-section">
          <img src={hero} alt="Hero" />
        </div>
        <Section key={sections[0].id} title={sections[0].title} products={shirts} />
        <Section key={sections[1].id} title={sections[1].title} products={oversizedTees} />
        <Section key={sections[2].id} title={sections[2].title} products={poloTees} />
      </div>
      <Footer />
    </div>
    
  );

};

export default HomePage;
