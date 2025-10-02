import { Link } from 'react-router-dom';
import './card.css'
import {  getSingleVariant } from '../utils/productServices';
import { useEffect, useState } from 'react';
const Card = ({ product, width = '310px' }) => {
  const [variant, setVariant] = useState(null);
  
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const variantId = product.variants[0];
        const  variantData  = await getSingleVariant(variantId);
        setVariant(variantData); // store the first variant directly
      } catch (error) {
        console.error("Error fetching variant:", error);
      }
    };

    fetchVariant();
  });
 if (!variant) return null; // or a loading spinner

  return (
    <Link to={`/product/${product?._id}`} className="card-link">
      <div className="card" style={{ ["--width"]: width }}>
        <img src={variant.images?.[0]} alt={product.name} />
        <h3>{product.name.length > 10 
              ? product.name.slice(0, 20) + "..." 
              : product.name}
          </h3>

        <p>{variant.discountPrice}</p>
      </div>
    </Link>
  );
};


export default Card;

