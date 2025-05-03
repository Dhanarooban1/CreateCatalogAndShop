import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ whatsappNumber }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  console.log(cart)

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.id === itemId 
        ? {...item, quantity: Math.max(1, newQuantity)} 
        : item
    );

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    // Add null/undefined checks and default values
    return cart.reduce((total, item) => {
      const price = parseInt(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const sendOrderToWhatsApp = () => {
console.log(cart)
    const orderDetails = cart.map((item, index) => {
      
      const price =Number(item.price)
      const quantity = Number(item.quantity) || 1;
      
      return `${index + 1}. ${item.name || 'Unknown Item'} x${quantity} - $${(price * quantity).toFixed(2)}`;
    }).join('%0A');
    
    const totalPrice = calculateTotal();
    const whatsappUrl = `https://wa.me/${6383363263}?text=Order%20Details:%0A${orderDetails}%0A%0ATotal:%20$${totalPrice}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Cart</h1>
          <Link 
            to="/ecommerce" 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Continue Shopping
          </Link>
        </header>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-2xl">Your cart is empty</p>
            <Link 
              to="/" 
              className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center bg-white p-4 mb-4 rounded-lg shadow"
              >
                <img 
                  src={item.image || '/placeholder-image.png'} 
                  alt={item.name || 'Product'} 
                  className="w-24 h-24 object-cover rounded mr-4" 
                />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">{item.name || 'Unnamed Product'}</h3>
                  <p className="text-gray-600">${(Number(item.price) || 0).toFixed(2)} each</p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) - 1)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-4">{Number(item.quantity) || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, (Number(item.quantity) || 1) + 1)}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-bold">${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between mb-4">
                <span className="text-2xl font-semibold">Total:</span>
                <span className="text-2xl font-bold">${calculateTotal()}</span>
              </div>
              <button 
                onClick={sendOrderToWhatsApp}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
              >
                Send Order to WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;