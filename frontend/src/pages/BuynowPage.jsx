import "./buynowPage.css"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { getSingleVariant } from "../utils/productServices";
import { addOrder, getUserProfile } from "../utils/userServices";
import editIcon from "../media/profileEdit.png";

const BuyNowPage = () => {
    const { ids } = useParams();
    const userId = JSON.parse(localStorage.getItem("userId"));

    const location = useLocation();
    const navigate = useNavigate();

    const [variants, setVariants] = useState([]);
    const [user, setUser] = useState(null);
    const [editBilling, setEditBilling] = useState(false);
    const [newAddress, setNewAddress] = useState({
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: ""
    });
    const [form, setForm] = useState({  
      userId: userId,
      fullName: user && user?.fullName,
      email: user && user?.email,
      phone: user && user?.phone,
      items: variants,
      totalAmount: 0,
      shippingAddress:  user && user?.addresses?.[0],
      payment: { method: "COD", status: "Pending" }

    });

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
    const fetchUserData = async () => {
        const userData = await getUserProfile(userId);
        setUser(userData);
    };
    if (ids) fetchVariants();
    if(userId) {
      fetchUserData();
    }
    else{
        navigate('/login');
    }}, [ids, userId, navigate]);
   

  const handleCardClick = (variantId) => {
    // Handle card click event
    console.log("Card clicked:", variantId);
    navigate(`/product/${variantId}`);
  };
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value});
      };
    const handleNewAddress = (e) => {
      setNewAddress({ ...newAddress, [e.target.name]: e.target.value});
      console.log(newAddress);
      };
  

  const handleConfirmOrder = async () => {
    const items = variants.map(variant => ({
    productId: variant.productId,
    variantId: variant._id,
    size: checkoutItems.find(item => item.id === variant._id)?.size,
    quantity: checkoutItems.find(item => item.id === variant._id)?.qty || 1,
    price: variant.discountPrice
  }));

  const totalAmount =
    variants.reduce(
      (acc, variant) =>
        acc + variant.discountPrice *
        (checkoutItems.find(item => item.id === variant._id)?.qty || 1),
      0
    ) + Shipping;

  const payment = { method: "COD", status: "Pending" };

  // 🔥 BUILD PAYLOAD DIRECTLY
  const payload = {
    userId,
    fullName: editBilling ? form.fullName : user.fullName,
    email: editBilling ? form.email : user.email,
    phone: editBilling ? form.phone : user.phone,
    items,
    totalAmount,
    payment,
    shippingAddress: editBilling
      ? {
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          country: newAddress.country,
          zipCode: newAddress.zipCode
        }
      : {
          street: user.addresses[0].street,
          city: user.addresses[0].city,
          state: user.addresses[0].state,
          country: user.addresses[0].country,
          zipCode: user.addresses[0].zipCode
        }
  };

  try {
    const res = await addOrder(payload);
    console.log("Order Response:", res);
    alert("Order placed successfully!");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Failed to place order");
  }
  }

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
            
          </div>
        </div>
        <div className="Billing Details">
          <div className="billing-header">
            <h3>Billing Details</h3>
            <img src={editIcon} alt="Edit Profile" onClick={() => setEditBilling(!editBilling)} />
          </div>
          {!editBilling && user && (
            <div key={user?._id} className="billing_details">
                <p className="info"><strong> Name:</strong> {user?.fullName}</p>
                <p className="info"><strong> Email:</strong> {user?.email}</p>
                <p className="info"><strong> Address:</strong> {`${user?.addresses?.[0].street}, ${user?.addresses?.[0].city}, ${user?.addresses?.[0].state}, ${user?.addresses?.[0].country}, ${user?.addresses?.[0].pin}`}</p>
                <p className="info"> <strong> Phone:</strong> {user?.phone}</p>
            </div>
          )}
          {editBilling && (
            <div className="edit_billing_form">
                <h3>Edit Billing Details</h3>
                <form>
                    <input type="text" placeholder="Full Name" name="fullName"  onChange={handleChange} /><br />
                    <input type="text" placeholder="Email" name="email"  onChange={handleChange} /><br />
                    <input type="text" placeholder="Phone Number" name="phone"onChange={handleChange} /><br />
                    <label>Address</label><br />
                    <input type="text" placeholder="Street" name="street" onChange={handleNewAddress} /><br />
                    <input type="text" placeholder="City" name="city" onChange={handleNewAddress} /><br />
                    <input type="text" placeholder="State" name="state" onChange={handleNewAddress} /><br />
                    <input type="text" placeholder="Country" name="country" onChange={handleNewAddress} /><br />
                    <input type="text" placeholder="Zip Code" name="zipCode" onChange={handleNewAddress} /><br />
                </form>
            </div>
          )}  
        </div>
        <button className="confirm-order" onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
      <Footer />
    </div>
  );
};

export default BuyNowPage;
