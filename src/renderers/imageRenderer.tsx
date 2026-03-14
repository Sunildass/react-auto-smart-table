import React from 'react';

export const ImageRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (!value) return null;
  const src = String(value);
  
  return (
    <img 
      src={src} 
      alt="cell content" 
      className="rst-cell-image" 
      style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'contain', borderRadius: '4px' }}
      loading="lazy"
    />
  );
};
