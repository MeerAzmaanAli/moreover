import "./buynowPage.css"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
// import local images from src/assets
import linenImg from "../media/linen-shirt.png";
import oversizedImg from "../media/oversized-tee.png";
import poloImg from "../media/polo-tee.png";
import hero from "../media/hero.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getSingleVariant } from "../utils/productServices";

const BuyNowPage = () => {
    const { ids } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [variants, setVariants] = useState([]);

    const checkoutItems  = location.state || {};
    const Shipping = 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVariants = async () => {
      try {
        const variantArray = [];
        for (const id of ids.split(",")) {
          const variant = await getSingleVariant(id);
          variantArray.push(variant);
        }
        setVariants(variantArray);
      } catch (error) {
        console.error("Error fetching variants:", error);
      }
    };

    if (ids) fetchVariants();
  }, [ids]);

  const handleCardClick = (variantId) => {
    // Handle card click event
    console.log("Card clicked:", variantId);
    navigate(`/product/${variantId}`);
  };

  return (
    <div>
      <Header />
      <div className="buy-now-page">
        <div className="pageAddress">
          buy/<strong>Bag</strong>
        </div>

        {variants.length > 0 ? (
          variants.map((variant) => (
            <div className="productCard" key={variant?._id} onClick={() => handleCardClick(variant.productId)}>
              <div className="card-left">
                <div className="productImage">
                  <img src={variant?.images?.[0]} alt="Product" />
                </div>
                <div className="productDetails">
                  <h4>{variant?.sku}</h4>
                  <p>Price: {variant?.discountPrice} rs</p>
                  <p>
                    Size: {checkoutItems.find(item => item.id === variant?._id)?.size} Qty: {checkoutItems.find(item => item.id === variant?._id)?.qty}
                  </p>
                </div>
              </div>
              <div className="card-right">
                <p>{variant?.discountPrice * checkoutItems.find(item => item.id === variant?._id)?.qty} rs</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <p>
              <span>Sub Total:</span>
              <strong>
                {variants.reduce(
                  (acc, variant) => acc + variant?.discountPrice * checkoutItems.find(item => item.id === variant?._id)?.qty || 1,
                  0
                )}{" "}
                rs
              </strong>
            </p>
            <p>Shipping: <strong>{Shipping} rs</strong></p>
            <p>
                Total: <strong>{" "}
                {variants.reduce(
                (acc, variant) => acc + variant?.discountPrice * checkoutItems.find(item => item.id === variant?._id)?.qty || 1,
                0
                ) + Shipping}{" "}
                rs</strong>
            </p>
            <button className="confirm-order">Confirm Order</button>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyNowPage;
