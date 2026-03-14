import React from 'react';

export const EmailRenderer: React.FC<{ value: any }> = ({ value }) => {
  if (!value) return null;
  const email = String(value);
  return (
    <a href={`mailto:${email}`} className="rst-cell-email" onClick={(e) => e.stopPropagation()}>
      {email}
    </a>
  );
};
