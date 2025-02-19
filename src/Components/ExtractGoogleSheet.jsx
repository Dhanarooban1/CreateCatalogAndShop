import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

function ExtractGoogleSheet() {
  const [sheetId, setSheetId] = useState('');
  const navigate = useNavigate();

  const extractSheetId = (url) => {
    const match = url.match(/\/d\/([-\w]{25,})/);
    return match ? match[1] : null;
  };

  const hashSheetId = (id) => btoa(id);

  const handleInputChange = (event) => {
    const url = event.target.value;
    const id = extractSheetId(url);
    if (id) {
      setSheetId(id);
    } else {
      console.error('Invalid Google Sheet URL');
    }
  };

  const handleNavigate = () => {
    if (sheetId) {
      const hashedId = hashSheetId(sheetId);
      navigate(`/select-template?sheet=${hashedId}`, { replace: true });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste Google Sheets URL"
        onChange={handleInputChange}
      />
      <button onClick={handleNavigate} disabled={!sheetId}>
        Go to Template Selection
      </button>
    </div>
  );
}

export default ExtractGoogleSheet;
