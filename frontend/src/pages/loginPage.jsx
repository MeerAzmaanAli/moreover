import { useEffect, useState } from "react";
import"./loginPage.css"
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../utils/userServices";

const LoginPage = () => {
    const navigate = useNavigate();

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const [form, setForm] = useState({fullName: "",
                                      email: "",
                                      phone: "",
                                      password: "",
                                      confirmPassword: ""
                                    });
    const [user, setUser] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        // Handle login logic here
        const loggedInUser = await loginUser(email, password);
        console.log(loggedInUser);
        setUser(loggedInUser);
        localStorage.setItem("authToken", loggedInUser.token);
        localStorage.setItem("userId", JSON.stringify(loggedInUser.user.id));
        navigate("/");
    };

    //this  handle signup in front end
    const handleSignup = async (event) => {
        event.preventDefault();

        const { fullName, email, phone, password, confirmPassword } = form;

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        // just call it password for now
        const newUser = await signupUser(email, password, fullName, phone);
        console.log(newUser);
        
        navigate("/login");
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <div className="login-header">
                <div className="header_left">
                    <div className="logo">
                        <a href="/">moreover</a>
                    </div>
                </div>
                <div className="header_right">
                    <div className="navs">
                        <a href={'/'}>Shop</a>
                    </div>
                </div>
            </div>
            <div className="login-container">
                <div className="login-signup">
                    <h4>Login</h4>
                    <h4>SignUp</h4>
                </div>
                <div className="forms">
                    <div className="login-form">
                        <form>
                            <input type="text" onChange={e => setEmail(e.target.value)} placeholder="Email" />
                            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                            <button className="submit" type="submit" onClick={handleLogin}>Login</button>
                        </form>
                    </div>
                    <div className="signup-form">
                        <form>
                            <input type="text" placeholder="Full Name" onChange={handleChange} name="fullName" value={form.fullName}/>
                            <input type="text" placeholder="Email" onChange={handleChange} name="email" value={form.email}/>
                            <input type="text" placeholder="Phone" onChange={handleChange} name="phone" value={form.phone}/>
                            <input type="password" placeholder="Password" onChange={handleChange} name="password" value={form.password}/>
                            <input type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={form.confirmPassword}/>
                            <button className="submit" type="submit" onClick={handleSignup}>Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
