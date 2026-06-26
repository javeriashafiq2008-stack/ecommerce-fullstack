import React, { createContext, useState, useEffect } from "react";
import { AddToCartLogic } from "../../CartUtils"

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);

   

const MOCK_PRODUCTS = [
  
  { 
    id: 2, 
    title: "Premium Wireless Headphones", 
    price: 199.99, 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 3, 
    title: "Minimalist Leather Watch", 
    price: 125.50, 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 4, 
    title: "Ergonomic Mechanical Keyboard", 
    price: 89.00, 
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 5, 
    title: "Urban Waterproof Backpack", 
    price: 65.00, 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 6, 
    title: "Classic White Sneakers", 
    price: 79.99, 
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 7, 
    title: "Matte Black Smart Thermos", 
    price: 34.50, 
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 8, 
    title: "Wireless Ergonomic Mouse", 
    price: 45.00, 
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 9, 
    title: "Aromatic Scented Candle Set", 
    price: 28.00, 
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 10, 
    title: "Polarized Retro Sunglasses", 
    price: 55.00, 
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80" 
  },
  
  { 
    id: 12, 
    title: "Vintage Denim Jacket", 
    price: 85.00, 
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 13, 
    title: "Desktop RGB Ring Light", 
    price: 24.99, 
    image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 14, 
    title: "Leather Pocket Journal", 
    price: 19.50, 
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 15, 
    title: "Compact Bluetooth Speaker", 
    price: 59.00, 
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 16, 
    title: "Ceramic Coffee Mug (Sage)", 
    price: 16.00, 
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80" 
  },
  
  { 
    id: 18, 
    title: "Premium Yoga Mat", 
    price: 49.99, 
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 19, 
    title: "Dimmable Bedside Lamp", 
    price: 32.00, 
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80" 
  },
  { 
    id: 20, 
    title: "Leather Bi-Fold Wallet", 
    price: 45.00, 
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80" 
  }
];

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, []);


    const HandleAddToCart = (productData) => {
    setCart((prevCart) => AddToCartLogic(prevCart, productData));
  };

  return (
    <ShopContext.Provider 
      value={{ 
        products, 
        cart, 
        setCart, 
        isCartOpen, 
        setIsCartOpen, 
        HandleAddToCart 
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};