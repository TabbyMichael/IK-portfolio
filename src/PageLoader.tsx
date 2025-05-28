// src/components/common/PageLoader.tsx
import React from 'react';
import './loader.css'; // Adjust path as needed

const PageLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="loader"></div>
  </div>
);

export default PageLoader;
