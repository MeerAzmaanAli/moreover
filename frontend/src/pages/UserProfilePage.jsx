import "./userProfilePage.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import editIcon from "../media/profileEdit.png";
import { useEffect, useState } from "react";
import { getUserProfile, updateProfile } from "../utils/userServices";
import { getUserOrders } from "../utils/userServices";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);   
    const [addresses, setAddresses] = useState([]);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({  
        _id: userId,
        fullName: user && user.fullName,
        phone: user && user.phone,
        addresses: user && user.addresses
    });


    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchUserData = async () => {
            const userData = await getUserProfile(userId);
            console.log(userData);
            setUser(userData);
            setAddresses(userData.addresses);
            setForm({ ...form, fullName: userData?.fullName || "", phone: userData?.phone || "", addresses: userData?.addresses || [] });
        };

        const fetchUserOrders = async () => {
            const userOrders = await getUserOrders(userId);
            setOrders(userOrders);
        };
        if(userId) {
          fetchUserData();
          fetchUserOrders();
          setForm({ ...form, fullName: user?.fullName || "", phone: user?.phone || "", addresses: user?.addresses || [] });
        }
        else{
            navigate('/login');
        }

    }, [userId]);

    const handleAddAddress = () => {
        const newAddress = { label: "", street: "", city: "", state: "", country: "", zipCode: "" };
        const updated = [...addresses, newAddress];
        setAddresses(updated);
        setForm({ ...form, addresses: updated });
    };
    // Update an address
    const handleAddressChange = (index, field, value) => {
        const updated = [...addresses];
        updated[index][field] = value;
        setAddresses(updated);
        setForm({ ...form, addresses: updated });
    };

    // Update main form fields
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value, addresses });
        };

        // Submit
        const handleSubmit = async (event) => {
        event.preventDefault();
        const { _id, fullName, phone, addresses } = form;
        try {
            const res = await updateProfile(_id, fullName, phone, addresses);
            console.log(res);
            setUser(res);
            setEdit(false);
        } catch (error) {
            console.log(error);
        }
    };
        const handleRemoveAddress = (index) => {
        const updated = [...addresses];
        updated.splice(index, 1);
        setAddresses(updated);
        setForm({ ...form, addresses: updated });
    };

    return (
        <div>
            <Header />
            <div className="profile_content">
                
                <div className="personal_info">
                    <div className="profile-header">
                        <h2>User Profile</h2>
                        <img src={editIcon} alt="Edit Profile" onClick={() => setEdit(!edit)} />
                    </div>
                    {!edit && user && (
                        <div key={user._id} className="user_details">
                            <p className="info"><strong> Name:</strong> {user.fullName}</p>
                            <p className="info"><strong> Email:</strong> {user.email}</p>
                            <div>
                                <h3 className="info"> Addresses:</h3>
                                {user.addresses && user.addresses.length > 0 ? (
                                    user.addresses.map((addr, index) => (
                                    <div key={index} style={{ marginBottom: "10px" }}>
                                        <p className="info" ><strong>{addr.label || `Address ${index + 1}`}:</strong></p>
                                        <p>- {addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.zipCode}</p>
                                        {addr.isDefault && <p><em>(Default)</em></p>}
                                    </div>
                                    ))
                                ) : (
                                    <p>No addresses saved.</p>
                                )}
                                </div>
                            <p className="info"> <strong> Phone:</strong> {user.phone}</p>
                        </div>
                        
                    )}
                    {edit && (
                    <div className="edit_form">
                        <h3>Edit Profile</h3>
                        <form>
                            <input type="text" placeholder="Full Name" name="fullName" value={form && form.fullName || ""} onChange={handleChange} />
                            <input type="text" placeholder="Phone Number" name="phone" value={form && form.phone || ""} onChange={handleChange} />
                             <div className="addresses_form">
                                <h4>Addresses</h4>
                                {form.addresses && form.addresses.map((addr, index) => (
                                    <div key={index} className="address_block">
                                    <div className="address_label">
                                        <h4><input type="text" value={addr.label || ""} onChange={(e) => handleAddressChange(index, "label", e.target.value)} /></h4>
                                        <button type="button" onClick={() => handleRemoveAddress(index)}><strong>-</strong></button>
                                    </div>
                                    <input  
                                        type="text"
                                        placeholder="Street Address"
                                        value={addr.street || ""}
                                        onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={addr.city}
                                        onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={addr.state}
                                        onChange={(e) => handleAddressChange(index, "state", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={addr.country}
                                        onChange={(e) => handleAddressChange(index, "country", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Zip Code"
                                        value={addr.zipCode}
                                        onChange={(e) => handleAddressChange(index, "zipCode", e.target.value)}
                                    />
                                    </div>
                                ))}

                                <div className="add_address">
                                    <button type="button" onClick={handleAddAddress}>
                                    <strong>+</strong>
                                    </button>
                                </div>
                                </div>
                            <button type="submit" className="save_button" onClick={handleSubmit}>Save Changes</button>

                        </form>
                    </div>)}
                </div>
                <div className="order_history">
                    <h3>Order History</h3>
                    {orders && orders.map(order => (
                        <div className="order_item" key={order._id}>
                            <p className="info">Order #{order._id}</p>
                            <p className="info">{order.totalAmount} rs | <strong>{order.status}</strong></p>
                        </div>
                    ))}
                </div>

            </div>
            <Footer />
        </div>
    );
};
export default UserProfilePage;