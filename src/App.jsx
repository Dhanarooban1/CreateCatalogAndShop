import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExtractGoogleSheet from './Components/ExtractGoogleSheet';
import TemplateSelection from './Components/TemplateSelection';
import Ecommerce from './Components/Ecommerce';

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<ExtractGoogleSheet />} />
        <Route path="/select-template" element={<TemplateSelection />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
      </Routes>
   
  );
}

export default App;
