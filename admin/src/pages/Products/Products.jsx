
import { useEffect, useState } from "react";
import SideDrawer from "../../components/SideDrawer";
import { deleteProduct, deleteVariant, getAllProducts, getAllVariants } from "../../utils/services";
import "./product.css";
import ProductForm from "../../components/ProductForm";
import VariantForm from "../../components/VariantForm"
const Products = () => {

  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const[addVariant,setAddVariant]= useState(false);
  const [productData,setProductData]=useState([{
    product:{},
    variants:[{}]
  },])
  const[productId,setProductId]=useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts()
      setProducts(res);
      setDrawerOpen(false);
    };
    const fetchVariants= async () =>{
      const res = await getAllVariants('-1');
      setVariants(res)
    }
    
    fetchProducts();
    fetchVariants();
    setProductData(()=>{
      if (products.length && variants.length) {
        const combined = products.map(product => {
          const productVariants = variants.filter(v => v.productId === product._id); 
          return {
            product,
            variants: productVariants
          };
        });
        return combined
      }
    });
  }, [variants.length]);

  const handleDeleteProduct= async (id)=>{
    try{
      const res =  await deleteProduct(id);
      console.log(res);
      
    }catch(error){
      console.log(error);
    }
    
  }
  const handleDeleteVariant= async (id)=>{
    try{
      const res =  await deleteVariant(id);
      console.log(res);

    }catch(error){
      console.log(error);
    }
    
  }

  return (
    <>
    <div className="page">
      <SideDrawer activeNav={1} />
      <div className="products-page">
        <div className="page-header">
          <h2>Products</h2>
          <button onClick={() => setDrawerOpen(true)}>Add Product</button>
        </div>
        <div className="list-container">
          <div className="card-header">
            <div className="search-container">
              <span className="material-symbols-outlined search-icon">search</span>
              <input className="search-input" placeholder="Search products" />
            </div>
            <div className="filter-buttons">
              <button className="filter-button">
                Category <span className="material-symbols-outlined">expand_more</span>
              </button>
              <button className="filter-button">
                Stock <span className="material-symbols-outlined">expand_more</span>
              </button>
              <button className="filter-button">
                Status <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          <div className="products-container">
              {productData && productData.map(product=>(
                <div className="product-card">
                  <div className="product">
                    <div className="product-detail">
                      <div> 
                        <h3>{product.product.name} </h3>
                        <p> | {product && product.product?.categories?.join(', ')}</p>
                      </div>
                      <div className="actions">
                        <button>edit</button>
                        <button onClick={()=>{handleDeleteProduct(product.product._id)}}>delete</button>
                        <button onClick={() => {
                          setProductId(product.product._id.toString())
                          setAddVariant(true);
                          
                          }}>+ V</button>
                      </div>
                    </div>
                    <div className="variants">
                      {product.variants && product.variants.map(variant =>(
                        <div className="variant-card">
                          <div className="variant-info">
                            <div>
                              <img src={variant.images && variant.images[0]} alt="" />
                              <p><strong>{variant.sku && variant.sku}</strong></p>
                              <p> - {variant.discountPrice && variant.discountPrice} rs </p>
                              <div style={{ backgroundColor: variant.color, borderRadius: 50, width: 30, height: 30, border: '1px solid #ccc', alignContent:"center" }}></div>
                            </div>
                           
                            <div className="actions">
                              <button>edit</button>
                              <button onClick={()=>{handleDeleteVariant(variant._id)}}>delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    {drawerOpen && (
            <>
                <div className="side-overlay" onClick={() => setDrawerOpen(false)}></div>
                <div className="drawer">
                    <button className="close-btn" onClick={() => setDrawerOpen(false)}>×</button>
                    <ProductForm />
                    <div className="side-content">

                    </div>
                </div>
            </>
        )}
      {addVariant && (
            <>
                <div className="side-overlay" onClick={() => setAddVariant(false)}></div>
                <div className="drawer">
                    <button className="close-btn" onClick={() => setAddVariant(false)}>×</button>
                    <VariantForm productId={productId}/>
                    <div className="side-content">

                    </div>
                </div>
            </>
        )}
    </>
  );
};

export default Products;
