import "./productPage.css";
import { useNavigate , useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

import linenImg from "../media/linen-shirt.png";
import ReviewCard from "../components/ReviewCard";
import { useEffect, useState } from "react";
import { getAllVariants, getSingleProduct } from "../utils/productServices";
import { addToCart } from "../utils/userServices";

const ProductPage = () => {
    const { id } = useParams();
    const userId = JSON.parse(localStorage.getItem("userId"));
    /*const [userId,setUserId] = useState("");
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }else{
            setUserId("");
            navigate('/login');
        }
    }, []);*/
    const navigate = useNavigate();
    const [ product,setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentVariant, setCurrentVariant] = useState(null);
    const [refresh, setRefresh] = useState(0);
    const [Switch, setSwitch] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const colors = [];
    

    const shirts = [
            { id: 's1', title: "Linen Shirt 1", price: "$50", image: linenImg, 
                sizes: { S: true, M: true, L: true, XL: true },
                colors: ['#e7e1bcff', '#77644fff', '#8ebd8eff'] }
            ];
    const Reviews =[
        { username: 'r1', title: "Great Shirt!", content: "I love this shirt. The material is soft and comfortable.", rating: 5 },
        { username: 'r2', title: "Not what I expected", content: "The color is different from the picture.", rating: 3 },
        { username: 'r3', title: "Would buy again", content: "Fits well and looks great.", rating: 4 }
    ];
    const setImageModal = (img) => {
        if (!isMobile) return;
        setCurrentImage(img);
        setImageOpen(true);
    };
    const selectSize = (size) => {
        setSelectedSize(size);
    };
    const selectColor = (color) => {
        setCurrentVariant(variants.find(variant => variant.color === color));
    };
    const navToBuyNow = () => {
        // Navigate to the Buy Now page with the selected variant
        const checkoutItems =[{
                    id: currentVariant._id,
                    size: selectedSize,
                    qty: 1
                }];
        if (!selectedSize) {
            alert("Please select a size before proceeding to buy.");
            return;
        }
       navigate(`/buy/${currentVariant._id}`, { state: checkoutItems });
    };
    const addtoCart = async() => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }
        // Add the current variant and selected size to the cart
        const cartItem = {
            userId: userId.replace(/"/g, ""),
            productId: product._id,
            variantId: currentVariant._id,
            size: selectedSize,
            quantity: 1
        };
        console.log("Cart Item:", cartItem);
        // Dispatch an action or call a function to add the item to the cart
        console.log("Adding to cart:", cartItem);
        try{
            const {userId, productId, variantId, size, quantity} = cartItem;
            const res = await addToCart(userId, productId, variantId, size, quantity);
            console.log("Add to cart response:", res);
            setRefresh(prev => prev + 1); // Trigger refresh in Header  
        }catch(error){
            console.error("Error adding to cart:", error);
        }
    };
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth <= 768; // breakpoint for mobile
        setIsMobile(mobile);
      };

      handleResize(); // run on mount
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const product = await getSingleProduct(id);
                setProduct(product);
                const variantsData = await getAllVariants(id);
                setVariants(variantsData);
                setCurrentVariant(variantsData[0]);
            } catch (error) {
                console.error("Error fetching product or variants:", error);
            }
        };
        fetchProduct();
    },[id]);
    for (const variant of variants) {
        colors.push(variant.color);
    }
   
    return (
        
        <div className="product-page">
            <Header refresh={refresh}/>
            <> 
                <div className="product-content">
                    <div className="left-container" style={{ flex: isMobile ? (Switch ? "8" : "2") : "2" }}>
                        {currentVariant && currentVariant.images.map((img, index) => (
                            <img key={index} src={img} alt={`${product.name} - ${currentVariant.color}`} onClick={() => setImageModal(img)} />
                        ))}
                        
                    </div>

                    <button className="split-toggle" onClick={() => setSwitch(!Switch)}><strong>{Switch ? "<" : ">"}</strong></button>

                    <div className="right-container" style={{ flex: isMobile ? (Switch ? "2" : "8") : "1" }}>
                        <div className="pageAddress">Home/{product && product.categories[0]}/<strong>{product && product.name}-{currentVariant && currentVariant.color}</strong></div>

                        <h2>{product && product.name}</h2>
                        <h3>{currentVariant && currentVariant.discountPrice}rs</h3>
                        <p><s>{currentVariant && currentVariant.price}rs</s></p>
                        <p className="description">{product && product.description}</p>
                        <div className="size-selector">
                            <h3>Size</h3>
                            <div className="size-options">
                                {currentVariant && currentVariant.size.map(size => (
                                    <div key={size} className="size" onClick={() => selectSize(size)}>
                                        {size}  
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="color-selector">
                            <h3>Colors</h3>
                            <div className="color-options">
                                {colors && colors.map((color, index) => (
                                    <div key={index} className="color" style={{ backgroundColor: color }} onClick={() => selectColor(color)}></div>
                                ))}
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="add-to-cart" onClick={addtoCart}>Add to Cart</button>
                            <button className="buy-now" onClick={navToBuyNow}>Buy Now</button>
                        </div>
                        <div className="additional-info">
                            <div className="left">
                                <div className="specs">
                                {currentVariant?.additionalAttributes && (
                                        <div>
                                            {Object.entries(currentVariant.additionalAttributes).map(([key, value]) => (
                                            <p key={key}><strong>{key}:</strong> {value}</p>
                                            ))}
                                        </div>)}
                                </div>
                            </div>
                            <div className="right">
                                <div className="reviews">
                                    <h3>Customer Reviews</h3>
                                    {Reviews.length > 0 ? (
                                        Reviews.map(review => (
                                            <ReviewCard key={review.username} review={review} />
                                        ))
                                    ) : (
                                        <p>No reviews yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {isMobile && imageOpen && (
                    <div className="image-modal" onClick={() => setImageOpen(false)}>
                        <div><img src={currentImage} alt="" /></div>
                    </div>

                )}
            </>
            <Footer />
        </div>
    );
};

export default ProductPage;
