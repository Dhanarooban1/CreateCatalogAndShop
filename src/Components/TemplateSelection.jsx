import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [searchParams] = useSearchParams();
  const sheetId = searchParams.get('sheet') || localStorage.getItem('sheetId');

  const selectTemplate = (template) => {
    if (!storeName.trim()) {
      alert('Please enter a store name');
      return;
    }

    localStorage.setItem('storeName', storeName);
    localStorage.setItem('template', template);
    navigate(`/ecommerce?sheet=${sheetId}&store=${encodeURIComponent(storeName)}&template=${template}`);
  };

  const navigateToShop = () => {
    if (!storeName.trim()) {
      alert('Please enter a store name');
      return;
    }
    navigate(`/shop?store=${encodeURIComponent(storeName)}`);
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter your store name" 
        value={storeName} 
        onChange={(e) => setStoreName(e.target.value)} 
      />
      <button onClick={() => selectTemplate('modern')}>Modern Store</button>
      <button onClick={() => selectTemplate('classic')}>Classic Store</button>
      <button onClick={() => selectTemplate('minimal')}>Minimal Store</button>
      <button onClick={() => selectTemplate('luxury')}>Luxury Store</button>
      <button onClick={navigateToShop}>Go to Shop</button>
    </div>
  );
};

export default TemplateSelection;