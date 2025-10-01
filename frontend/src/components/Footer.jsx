import "./footer.css"

const Footer = () => {
  return (
    <footer>
        <div className="services-about">
            <a href="/Customer Service"> Customer Service</a>
            <a href="/About Us">About Us</a>
        </div>
        <div className="socials">
            <img src="https://img.icons8.com/?size=100&id=118487&format=png&color=000000" alt="Facebook" />
            <img src="https://img.icons8.com/?size=100&id=fJp7hepMryiw&format=png&color=000000" alt="Twitter" />
            <img src="https://img.icons8.com/?size=100&id=DpOQ6G5p47f0&format=png&color=000000" alt="Instagram" />
        </div>
        <div className="copyright">
          <p>© 2025 Moreover. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
