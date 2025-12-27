const API_BASE = "https://moreover-backend.onrender.com/api/user";
const token = localStorage.getItem("token");

const loginUser = async (email, password) => {
    try { 
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error("Error logging in:", error);
    }
};

//this is the signup user service for front end
const signupUser = async (email, password, fullName, phone) => {
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        passwordHash: password, // backend expects this key
        fullName,
        phone
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

const getUserProfile = async (id) => {
  try {

    const response = await fetch(`${API_BASE}/profile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const getUserOrders = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user orders:", error);
  }
};
const getUserCart = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/cart/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching user cart:", error);
  }
};
const addToCart = async (userId, productId, variantId, size, quantity) => {
  try {
    const response = await fetch(`${API_BASE}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId, productId, variantId, size, quantity })
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};
const addOrder = async (orderData) => {
  {}
  try {
    const response = await fetch(`${API_BASE}/orders/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding order:", error);
  }
};
const updateProfile = async (_id, fullName, phone, addresses) => {
  try {
    const response = await fetch(`${API_BASE}/profile/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        _id, 
        fullName, 
        phone, 
        addresses
      })
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};
const removeFromCart = async (userId,itemId) => {
  try {
    const response = await fetch(`${API_BASE}/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userId, itemId })
    });
    return await response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};
const updateCartItem = async (userId , itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE}/cart/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({userId, itemId, quantity })
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};
export { loginUser, signupUser, getUserProfile, getUserCart, removeFromCart, updateCartItem, getUserOrders , addToCart, addOrder, updateProfile };