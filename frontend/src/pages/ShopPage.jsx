import "./shopPage.css"
import { useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RangeSlider from "../components/RangeSlider";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getProductsByCategory, searchProducts } from "../utils/productServices";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ShopPage = () => {
    const { section } = useParams();
    const [priceRange, setPriceRange] = useState([0, 99999]);
    const [products, setProducts] = useState([]);
    const [filterOpen, setFilterOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [cardWidth, setCardWidth] = useState("170px");

    const query = useQuery().get("q") || "";
     useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth <= 768; // breakpoint for mobile
        setIsMobile(mobile);
        if (!mobile) {
          setFilterOpen(true);
          setCardWidth("170px");
        } // always open on desktop
        else {
          setFilterOpen(false);
          setCardWidth("125px");
        }        // start closed on mobile
      };

      handleResize(); // run on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      window.scrollTo(0, 0);
      const fetchProducts = async () => {
        try {
          
          const sectionName = decodeURIComponent(section) .replace(/\s+/g, "");
          const allProducts = await getProductsByCategory(sectionName);
          const filteredProducts = allProducts.filter(product => {
            const withinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
            return withinPriceRange;
          });
          setProducts(allProducts);
          console.log(allProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      if(section!=="search"){
        fetchProducts();
      }
    }, [section, priceRange]);

    useEffect(() => {
      window.scrollTo(0, 0);
      const fetchResults = async () => {
        try{
            if (query.length > 1) {
            const data = await searchProducts(query);
            setProducts(data);
          } else {
            setProducts([]);
          }
        }catch(error){
          console.error("Error searching products:", error);
        }
      };
      if(section==="search"){
        const debounce = setTimeout(fetchResults, 300); // debounce API calls
        return () => clearTimeout(debounce);
      }
  }, [query]);

  return (
    <div className="shop-page">
        <Header />
        <div className="shop-content">
          {isMobile && (<button
            className="filter-toggle-btn"
            onClick={() => setFilterOpen(!filterOpen)}
          >filter</button>)}
          {filterOpen && (<div className="shop-left-container">
            <div className="label" id="filter">Filter
                <div className="sub-label" id="size-container"> Size
                    <div className="shop-size-content">
                        <div className="shop-size"><input type="checkbox"/><p>S</p></div>
                        <div className="shop-size"><input type="checkbox"/><p>M</p></div>
                        <div className="shop-size"><input type="checkbox"/><p>L</p></div>
                        <div className="shop-size"><input type="checkbox"/><p>XL</p></div>
                    </div>
                </div>
                <div className="sub-label" id="color-container"> Color
                    <div className="color-content">
                        <div className="color" style={{ backgroundColor: "#f1ead4ff" }}></div>
                        <div className="color" style={{ backgroundColor: "#B2AC88" }}></div>
                        <div className="color" style={{ backgroundColor: "#987654" }}></div>
                        <div className="color" style={{ backgroundColor: "#D3D3D3" }}></div>
                    </div>
                </div>
                <div className="sub-label" id="price"> Price
                    <RangeSlider min={0} max={200} step={5} value={priceRange} onChange={setPriceRange} />
                </div>
                <div className="sub-label" id="fit-container"> Fit
                    <div className="fit-content">
                        <div className="fit"><input type="checkbox"/><p>Slim Fit</p></div>
                        <div className="fit"><input type="checkbox"/><p>Relaxed Fit</p></div>
                        <div className="fit"><input type="checkbox"/><p>Loose Fit</p></div>
                    </div>
                </div>
            </div>

          </div>)}
          
          <div className="shop-right-container">
            <div className="pageAddress">Home/<strong>{section}</strong></div>
            <div className="heading">{section}</div>
            <div className="product-list">
              {products.map(product => (
                product.variants.map(variant => (
                <Card key={variant} product={product} width={cardWidth} />
                ))
              ))}
            </div>
          </div>
        </div>
        <Footer />
    </div>
  );
};

export default ShopPage;
