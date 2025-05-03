import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileSpreadsheet, AlertCircle } from 'lucide-react';

function ExtractGoogleSheet() {
  const [sheetId, setSheetId] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
    
    // Animation for entrance
    const timer = setTimeout(() => {
      document.querySelector('.content-container').classList.add('opacity-100');
      document.querySelector('.content-container').classList.remove('opacity-0', 'translate-y-4');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const extractSheetId = (url) => {
    let id = null;
    
    // Handle different Google Sheet URL formats
    const standardMatch = url.match(/\/d\/([\w-]{25,})/);
    const publishedMatch = url.match(/\/d\/e\/([\w-]{25,})/);
    const directMatch = url.match(/^([\w-]{25,})$/);
    
    if (standardMatch) id = standardMatch[1];
    else if (publishedMatch) id = publishedMatch[1];
    else if (directMatch) id = directMatch[1];
    
    return id;
  };

  const hashSheetId = (id) => btoa(id);

  const handleInputChange = (event) => {
    const inputUrl = event.target.value;
    setUrl(inputUrl);
    setError('');
    
    const id = extractSheetId(inputUrl);
    if (id) {
      setSheetId(id);
    } else if (inputUrl && !id) {
      setError('Invalid Google Sheets URL format');
      setSheetId('');
    }
  };

  const handleNavigate = async () => {
    if (!sheetId) {
      setError('Please enter a valid Google Sheets URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate if the sheet exists and is accessible
      const hashedId = hashSheetId(sheetId);
      
      // Store the sheet ID for later use
      localStorage.setItem('sheetId', hashedId);
      
      // Navigate to template selection
      setTimeout(() => {
        navigate(`/select-template?sheet=${hashedId}`, { replace: true });
      }, 500); // Small delay for a smoother transition
    } catch (error) {
      setError('Could not access the sheet. Please check URL and sharing permissions.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="content-container opacity-0 translate-y-4 transition-all duration-500 max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="flex items-center justify-center mb-6">
          <FileSpreadsheet size={32} className="text-blue-600 dark:text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sheet to Store</h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Transform your Google Sheet into a beautiful e-commerce store in seconds
        </p>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Google Sheets URL
            </label>
            <input
              id="sheetUrl"
              type="text"
              placeholder="Paste your Google Sheets URL here"
              value={url}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            />
            {error && (
              <div className="flex items-center mt-2 text-red-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                <span>{error}</span>
              </div>
            )}
            {sheetId && !error && (
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ Valid Sheet ID detected
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <button
              onClick={handleNavigate}
              disabled={!sheetId || isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-all ${
                !sheetId || isLoading 
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
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Continue to Templates <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Create a Google Sheet with columns: Name, Price, Description, Image URL, Stock</li>
            <li>Make sure your sheet is public or shared with "Anyone with the link"</li>
            <li>Paste the URL above and choose your template</li>
            <li>Your store will be instantly created and ready to share</li>
          </ol>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Your store will be optimized for all devices and accessible to everyone
      </p>
    </div>
  );
}

export default ExtractGoogleSheet;