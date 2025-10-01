import "./sideDrawer.css";
import React, { useEffect, useState } from "react";

const SideDrawer = ({ activeNav }) => {
  const [navs, setNavs] = useState([
    { name: "Dashboard", icon: "dashboard", link: "/", active: false },
    { name: "Products", icon: "inventory_2", link: "products", active: false },
    { name: "Orders", icon: "shopping_cart", link: "orders", active: false },
    { name: "Customers", icon: "group", link: "customers", active: false },
  ]);

  useEffect(() => {
    if (activeNav !== undefined && activeNav < navs.length) {
      setNavs((prev) =>
        prev.map((nav, index) => ({
          ...nav,
          active: index === activeNav, // only one active
        }))
      );
    }
  }, [activeNav]);



  return (
    <div className="side-drawer">
       <div className="sidebar-header">
          <div className="logo-icon">
          </div>
          <h2>moreover admin</h2>
        </div>

        <nav className="sidebar-nav">
          {navs.map((nav, index) => (
            <a key={index} href={nav.link} className={nav.active ? "active" : ""}>
              <span className="material-symbols-outlined">{nav.icon}</span>
              {nav.name}
            </a>
          ))} 
        </nav>

        <div className="sidebar-footer">
          <div
            className="profile-pic"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIYa_RLQ2qkvkKfRyv9SCi5KEt44ipEMLPlrad3rdlLLVkL1MnrWVxeqHS8IPxSbWxIbF4LF5WI4STOb-ZlbGgDE52ZtjYfF7Vg_4ZXUXIH3skckC9Bt2rcRVxs4e94Pfas4PNDNQw3KVmvm56rBoq7w7cIkp0Gcb2yirTwpAHKFuH74c3fZNu2yH0fNd2uERbOms_CyEy8dHsh3PaGfSFJXftfQ1TfJYj1YI--rLlj5BnBOc5nleuOmsGp0XraRkQKW_lw2dsyEQ")',
            }}
          ></div>
        </div>
      
    </div>
  );
};

export default SideDrawer;
