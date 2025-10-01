import "./header.css";

import user_icon from "../media/profile.png";
import cart_icon from "../media/bag.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserCart, removeFromCart } from "../utils/userServices";
import { getSingleVariant } from "../utils/productServices";

const Header = ({refresh}) => {
    const navigate = useNavigate();
    let refreshFlag = refresh;
    const [cartOpen ,setCartOpen] = useState(false);
    const userId = JSON.parse(localStorage.getItem("userId"));
    const[cartItems, setCartItems] = useState([]);
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const openCart = () => setCartOpen(true);
    const closeCart = () => setCartOpen(false);

     const navsList = [
        { name: "Linen Shirts", path: "/Linen Shirts" },
        { name: "Oversized Tees", path: "/Oversized Tees" },
        { name: "Polo Tees", path: "/Polo Tees" },
    ];

    useEffect(() => {
        const fetchCartItems = async () => {   
            try {
                // 1. Get the cart from your backend
                const cart = await getUserCart(userId); // returns [{ productId, variantId, size, quantity }, ...]

                // 2. Fetch product details for each cart item
                const enrichedCart = await Promise.all(
                cart.map(async (item) => {
                    const product = await getProduct(item.variantId);
                    return {
                    ...item,
                    product, // attach full product details
                    };
                })
                );
                const checkoutData = cart.map(element => ({
                    id: element.variantId,
                    size: element.size,
                    qty: element.quantity
                }));

                setCheckoutItems(checkoutData);
                setCartItems(enrichedCart);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };
        if(userId) {
            fetchCartItems();
        }

    }, [userId, refreshFlag]);

    const getProduct=async(variantId)=>{
        try{
            const res = await getSingleVariant(variantId);
            return res;
        }catch(error){
            console.error("Error fetching product:", error);
        }
    }
    const navtouserprofile = () => {
        window.location.href = `/user/${userId}`;
    };

    const handleCheckout = () => {
        const idParams = checkoutItems.map(item => item.id).join(",");
        // pass the full objects as state
        navigate(`/buy/${idParams}`, { state: checkoutItems });
    }

    const removefromCart = async (itemId) => {
        // Implement remove from cart functionality
        console.log("Remove item with variantId:", itemId);
        try{
            const res = await removeFromCart(userId, itemId);

            if(res.ok){
                console.log("Remove from cart response:", res);
                refreshFlag= refreshFlag+1; // Trigger refresh in Header
            }
        }catch(error){  
            console.error("Error removing from cart:", error);
        }

    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchInput)}`);
            setSearchInput(""); // optional: clear after search
        }
    };
return (
    <>
        <header>
            <div className="header_left">
                <div className="logo">
                    <a href="/">moreover</a></div>
                <div className="navs">
                    {navsList.map((nav, index) => (
                        <a key={index} href={nav.path}>
                            {nav.name}
                        </a>
                    ))}
                </div>
            </div>
            <div className="header_right">
                <div className="search_bar">
                    <input type="text" placeholder="Search..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <button className="search_button" onClick={handleSearch}>⌕</button>
                </div>
                
                <div className="user_profile">

                    <img src={user_icon} alt="user profile"  onClick={() => { navtouserprofile() }} />
                    <img src={cart_icon} alt="cart"  onClick={() => {openCart() }} />
                </div>
            </div>
        </header>
        {cartOpen && (
            <>
                <div className="cart-overlay" onClick={closeCart}></div>
                <div className="cart-drawer">
                    <button className="close-btn" onClick={closeCart}>×</button>
                    <h2>In Bag</h2>
                    <div className="cart-content">

                        {userId && cartItems && cartItems.map(item => {
                            const product = item.product;
                            if (!product) return null; // or a loading state
                            return (
                                <div key={item._id} className="cart-item" onClick={ () => { window.location.href = `/product/${item.productId}`; }}
                                >
                                    <img src={ product.images && product.images[0]} alt={product.sku} />
                                    <div className="cart-item-details" >
                                        <div>
                                            <h3 >{product.sku}</h3> 
                                            <p>Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <p>{(product.discountPrice * item.quantity).toFixed(1)}</p>
                                        <button className="remove-btn" onClick={() => removefromCart(item._id)}>x</button>
                                    </div>
                                </div>
                            );
                        })}
                        {!userId && (
                            <><p>Please log in to view your cart.</p>
                            <button onClick={() => navigate('/login')}>Login</button></>
                        )}
                    </div>
                    <div className="cart-footer">
                        <p>Total: rs {cartItems.reduce((total, item) => {
                            const product = item.product;
                            return total + (product ? parseFloat( product.discountPrice) : 0);
                        }, 0).toFixed(2)}</p>
                        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            </>
        )}
    </>
);
};

export default Header;
