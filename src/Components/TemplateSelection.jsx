import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Templates from '../Services/Templates';
import { Check, ChevronRight, Store, Palette, ArrowLeft } from 'lucide-react';

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // 1: Store Info, 2: Template Selection
  const [isLoading, setIsLoading] = useState(false);
  
  const sheetId = searchParams.get('sheet') || localStorage.getItem('sheetId');
  
  useEffect(() => {
    // Check for any saved store info
    const savedStoreName = localStorage.getItem('storeName');
    if (savedStoreName) setStoreName(savedStoreName);
    
    const savedDescription = localStorage.getItem('storeDescription');
    if (savedDescription) setStoreDescription(savedDescription);
    
    // Animation for entrance
    const timer = setTimeout(() => {
      document.querySelector('.content-container').classList.add('opacity-100');
      document.querySelector('.content-container').classList.remove('opacity-0', 'translate-y-4');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNext = () => {
    if (activeStep === 1) {
      if (!storeName.trim()) {
        alert('Please enter a store name');
        return;
      }
      localStorage.setItem('storeName', storeName);
      if (storeDescription) localStorage.setItem('storeDescription', storeDescription);
      setActiveStep(2);
    } else {
      // Final step - navigate to the store
      finalize();
    }
  };
  
  const handleBack = () => {
    setActiveStep(1);
  };

  const selectTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
  };
  
  const finalize = () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }
    
    setIsLoading(true);
    
    localStorage.setItem('template', selectedTemplate);
    
    setTimeout(() => {
      navigate(`/ecommerce?sheet=${sheetId}&store=${encodeURIComponent(storeName)}&template=${selectedTemplate}`);
    }, 500); // Small delay for a smoother transition
  };
  
  const renderStoreInfo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Tell us about your store</h2>
      
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Store Name*
        </label>
        <input 
          id="storeName"
          type="text" 
          placeholder="e.g. Modern Essentials, Tech Haven..." 
          value={storeName} 
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
        />
      </div>
      
      <div>
        <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Store Description (optional)
        </label>
        <textarea 
          id="storeDescription"
          placeholder="Brief description of your store and products..." 
          value={storeDescription} 
          onChange={(e) => setStoreDescription(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
        />
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleNext}
          disabled={!storeName.trim()}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
            !storeName.trim() 
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md hover:shadow-lg'
          }`}
        >
          <span className="flex items-center">
            Choose Template <ChevronRight size={18} className="ml-2" />
          </span>
        </button>
      </div>
    </div>
  );
  
  const renderTemplateSelection = () => (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white ml-4">Choose Your Template</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {Object.entries(Templates).map(([key, template]) => (
          <div 
            key={key} 
            className={`border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden ${
              selectedTemplate === key 
                ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => selectTemplate(key)}
            style={{
              backgroundColor: template.backgroundColor,
              color: template.textColor,
            }}
          >
            {selectedTemplate === key && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
            
            <h3 className="text-xl font-semibold mb-2" style={{ color: template.primaryColor }}>
              {template.name}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {template.description}
            </p>
            
            <div className="flex items-center mb-3">
              <div 
                className="w-6 h-6 rounded-full mr-2"
                style={{ backgroundColor: template.primaryColor }}
              />
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: template.secondaryColor }}
              />
              <div className="ml-auto text-xs">
                {template.style}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Best for: {template.bestFor}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <button
          onClick={handleNext}
          disabled={!selectedTemplate || isLoading}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
            !selectedTemplate || isLoading
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating your store...
            </span>
          ) : (
            <span className="flex items-center">
              Create My Store <Store size={18} className="ml-2" />
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="content-container opacity-0 translate-y-4 transition-all duration-500 max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="flex items-center justify-center mb-8">
          <Palette size={28} className="text-blue-600 dark:text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Design Your Store</h1>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              1
            </div>
            <div className={`h-1 flex-1 mx-2 ${
              activeStep > 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Store Details</span>
            <span>Choose Template</span>
          </div>
        </div>
        
        {activeStep === 1 ? renderStoreInfo() : renderTemplateSelection()}
      </div>
      
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Your store will be optimized for all devices and accessible to everyone
      </p>
    </div>
  );
};

export default TemplateSelection;