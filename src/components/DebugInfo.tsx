import React from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const DebugInfo: React.FC = () => {
  const testAPI = async () => {
    try {
      console.log('Testing API with URL:', API_BASE_URL);
      const response = await fetch(API_ENDPOINTS.HEALTH);
      const data = await response.json();
      console.log('API Response:', data);
      alert(`API is working! URL: ${API_BASE_URL}\nResponse: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('API Error:', error);
      alert(`API Error: ${error.message}\nURL: ${API_BASE_URL}`);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>API URL: {API_BASE_URL}</div>
      <div>Environment: {import.meta.env.MODE}</div>
      <div>Hostname: {window.location.hostname}</div>
      <button onClick={testAPI} style={{ marginTop: '5px', fontSize: '10px' }}>
        Test API
      </button>
    </div>
  );
};

export default DebugInfo;
