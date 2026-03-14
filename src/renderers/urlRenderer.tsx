import React from 'react';

export const UrlRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (!value) return null;
  const url = String(value);
  
  // Ensure we have a protocol for the href
  const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="rst-cell-url"
      onClick={(e) => e.stopPropagation()}
    >
      {url}
    </a>
  );
};
