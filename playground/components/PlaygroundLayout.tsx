import React from 'react';

interface PlaygroundLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export const PlaygroundLayout: React.FC<PlaygroundLayoutProps> = ({ leftPanel, rightPanel }) => {
  return (
    <div className="playground-wrapper">
      <header className="playground-hero">
        <h1>SmartTable Playground</h1>
        <p>Paste any JSON dataset and instantly generate filters, insights, and tables.</p>
      </header>
      
      <div className="playground-container">
        <div className="playground-left">
          {leftPanel}
        </div>
        <div className="playground-right">
          {rightPanel}
        </div>
      </div>
    </div>
  );
};
