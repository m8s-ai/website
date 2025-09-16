import React from 'react';

const Debug: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#00ff00' }}>🎯 React App is Working! (File conflict fixed)</h1>
      <p>If you can see this green text and dark background, React is rendering correctly.</p>
      
      <div style={{ 
        border: '2px solid #00ff00', 
        padding: '10px', 
        margin: '20px 0',
        borderRadius: '8px'
      }}>
        <h2>Debug Information:</h2>
        <ul>
          <li>✅ React is loaded</li>
          <li>✅ TypeScript is working</li>
          <li>✅ Styling is applied</li>
          <li>✅ Routing is functional</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Available Routes:</h3>
        <ul>
          <li><a href="/" style={{ color: '#00aaff' }}>/ - Main Website</a></li>
          <li><a href="/claude-flow" style={{ color: '#00aaff' }}>/claude-flow - Claude Flow UI</a></li>
          <li><a href="/debug" style={{ color: '#00aaff' }}>/debug - This Debug Page</a></li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#333', 
        padding: '15px', 
        marginTop: '20px',
        borderRadius: '8px'
      }}>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Debug;