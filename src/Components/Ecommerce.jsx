import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ExtractGoogleSheetData from '../Services/sheet';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Search } from 'lucide-react';
import Templates from '../Services/Templates';

const Ecommerce = () => {
  const [searchParams] = useSearchParams();
  const [sheetData, setSheetData] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
  // Get parameters from URL or localStorage with fallbacks
  const sheetHash = searchParams.get('sheet') || localStorage.getItem('sheetId');
  const store = searchParams.get('store') || localStorage.getItem('storeName') || 'Our Store';
  const template = searchParams.get('template') || localStorage.getItem('template') || 'modern';

  // Save parameters to localStorage for persistence
  useEffect(() => {
    if (sheetHash) localStorage.setItem('sheetId', sheetHash);
    if (store) localStorage.setItem('storeName', store);
    if (template) localStorage.setItem('template', template);
  }, [sheetHash, store, template]);

  const decodeSheetId = (hash) => {
    try {
      return atob(hash);
    } catch (error) {
      console.error('Failed to decode sheet ID:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      if (!sheetHash) {
        setError('No sheet ID provided. Please add a sheet parameter to the URL.');
        setLoading(false);
        return;
      }

      const sheetId = decodeSheetId(sheetHash);
      if (!sheetId) {
        setError('Invalid sheet ID format. Please check the URL parameters.');
        setLoading(false);
        return;
      }

      try {
        const rawData = await ExtractGoogleSheetData(sheetId);
        
        if (!rawData || !Array.isArray(rawData) || rawData.length <= 1) {
          setError('No product data found or sheet is empty.');
          setLoading(false);
          return;
        }

        const formattedData = rawData.slice(1).map((row) => {
          const rawPrice = row[1]?.trim() || '0';
          const price = Number(rawPrice.replace(/[^0-9.-]+/g, '')) || 0;

          return {
            id: crypto.randomUUID(),
            name: row[0]?.trim() || 'Unnamed Product',
            price: price,
            description: row[2]?.trim() || 'No description available',
            image: row[3]?.trim() || '/api/placeholder/300/200',
            stock: parseInt(row[4]?.trim() || '10'),
          };
        });
        
        setSheetData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        setError('Failed to load product data. Please try again later.');
        setLoading(false);
      }
    };

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    fetchData();
  }, [sheetHash]);

  const addToCart = (item) => {
    if (item.stock <= 0) {
      alert('Sorry, this item is out of stock.');
      return;
    }
    
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const existingItem = updatedCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= item.stock) {
          alert(`Sorry, only ${item.stock} in stock.`);
          return prevCart;
        }
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        updatedCart.push({ ...item, quantity: 1 });
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const downloadCatalogAsPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80); // Dark blue-gray
      doc.text(`${store} Product Catalog`, 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on: ${today}`, 14, 28);

      const tableData = sheetData.map((item) => [
        item.name,
        `${item.price.toFixed(2)}`,
        item.description.length > 50 ? item.description.substring(0, 50) + '...' : item.description,
        item.stock > 0 ? `${item.stock} in stock` : 'Out of stock',
      ]);

      autoTable(doc, {
        head: [['Product Name', 'Price', 'Description', 'Availability']],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [44, 62, 80],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
    
      doc.save(`${store.toLowerCase().replace(/\s+/g, '_')}_catalog.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sheetData;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'stock':
        return [...filtered].sort((a, b) => b.stock - a.stock);
      default:
        return filtered;
    }
  }, [sheetData, searchTerm, sortOption]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const currentStyles = Templates[template] || Templates.modern;

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ 
        backgroundColor: currentStyles.backgroundColor, 
        color: currentStyles.textColor,
        fontFamily: currentStyles.fontFamily
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className={`mb-8 p-4 rounded-lg ${currentStyles.headerStyle}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: currentStyles.primaryColor }}>
                {store}
              </h1>
              <p className="text-sm opacity-70 mt-1">
                Theme: {template.charAt(0).toUpperCase() + template.slice(1)}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadCatalogAsPDF}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Download Catalog
              </button>
              <Link
                to="/cart"
                className={`relative py-2 px-4 rounded-lg transition-colors text-white ${currentStyles.buttonStyle}`}
              >
                🛒 Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: currentStyles.primaryColor + '40' }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ borderColor: currentStyles.primaryColor + '40' }}
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="stock">Availability</option>
            </select>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Product Grid */}
        
        {!loading && !error && filteredAndSortedProducts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg transition-all duration-300 hover:${currentStyles.hoverEffect} ${currentStyles.cardBorder}`}
                style={{ backgroundColor: currentStyles.cardBackground }}
              >
                {/* Product Image */}
                <div className="relative mb-4">
                  <img
                    src={item.image || '/api/placeholder/300/200'}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  {item.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded text-xs">
                      Out of Stock
                    </div>
                  )}
                  {item.stock > 0 && item.stock <= 5 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white py-1 px-2 rounded text-xs">
                      Low Stock: {item.stock}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                <p className="text-sm opacity-70 mt-2 h-16 overflow-hidden">
                  {item.description}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(item)}
                  disabled={item.stock <= 0}
                  className={`mt-4 w-full py-2 px-4 rounded-lg text-white transition-colors ${
                    item.stock <= 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-200 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} {store}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Ecommerce;