import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExtractGoogleSheet from './Components/ExtractGoogleSheet';
import TemplateSelection from './Components/TemplateSelection';
import Ecommerce from './Components/Ecommerce';
import Cart from './Services/Card';
function App() {
  const whatsappNumber = localStorage.getItem('whatsappNumber') || '7092005804';
  return (

    <Routes>
      <Route path="/" element={<ExtractGoogleSheet />} />
      <Route path="/select-template" element={<TemplateSelection />} />
      <Route path="/ecommerce" element={<Ecommerce />} />
      <Route path="/cart" element={<Cart whatsappNumber={whatsappNumber} />} />
    </Routes>

  );
}

export default App;
