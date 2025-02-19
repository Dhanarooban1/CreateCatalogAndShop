import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ExtractGoogleSheetData from '../Services/sheet'



const Ecommerce = () => {
  const [searchParams] = useSearchParams();
  const [sheetData, setSheetData] = useState([]);

  const sheetHash = searchParams.get('sheet') || localStorage.getItem('sheetId');

  
  const store = searchParams.get('store') || localStorage.getItem('storeName');
  const template = searchParams.get('template') || localStorage.getItem('template');

  const decodeSheetId = (hash) => {
    try {
      return atob(hash);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (sheetHash) {
        const sheetId = decodeSheetId(sheetHash);
        
        if (sheetId) {
          try {
            const data = await ExtractGoogleSheetData(sheetId);
            console.log(data)
            setSheetData(data);
          } catch (error) {
            console.error('Error fetching Google Sheets data:', error);
          }
        }
      }
    };
  
    fetchData();
  }, [sheetHash]);

 
      

  return (
    <div>
      <h1>Welcome to {store ? store : 'our store'}!</h1>
      <p>Template: {template ? template.charAt(0).toUpperCase() + template.slice(1) : 'Not selected'}</p>

      <h2>Product List</h2>
      {sheetData.length > 0 ? (
        <ul>
          {sheetData.map((item, index) => (
            <li key={index}>{item.name} - ${item.price}</li>
          ))}
        </ul>
      ) : (
        <p>Loading product data...</p>
      )}
    </div>
  );
};

export default Ecommerce;
