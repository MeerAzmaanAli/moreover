import './App.css';
import{BrowserRouter,Routes,Route}from"react-router-dom";
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Orders from './pages/Orders/Orders';
import Customers from './pages/Customers/Customers';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
