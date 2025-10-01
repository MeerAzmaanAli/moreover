import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import UserProfilePage from './pages/UserProfilePage';
import BuyNowPage from './pages/BuynowPage';
import LoginPage from './pages/loginPage';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:section" element={<ShopPage/>} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
        <Route path="/buy/:ids" element={<BuyNowPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
