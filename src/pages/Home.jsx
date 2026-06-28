import React, { useContext } from 'react';
import ProductCard from '../components/product/ProductCard';
import Navbar from '../components/Navbar';
import { ShopContext } from '../components/context/ShopContext';

function Home() {
  // Global context state
  const { products, HandleAddToCart } = useContext(ShopContext);

  return (
    <>
      

      {/* Product Catalog Grid */}
      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((item) => (
            <ProductCard
              product={item}
              key={item.id}
              image={item.image}
              name={item.title}
              price={item.price}
              rating={4}
              reviews={18}
              onAddToCart={HandleAddToCart}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;