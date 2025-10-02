import './section.css'
import Card from "./Card";

const Section = ({ title, products }) => {
  products = products.slice(0, 6); // Limit to first 3 products
  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">{title}</div>
        <a href={`/${title}`}>View All</a>
      </div>
      <div className="section-product-list">
        {products.map(p => (
          <Card key={p._id} product={p} />
        ))} 
      </div>
    </div>
  );
};

export default Section;
