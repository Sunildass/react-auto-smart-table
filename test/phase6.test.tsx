import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartTable } from '../src/components/SmartTable';
import { Dataset } from '../src/schema/schemaTypes';

// Use fake timers to let standard rendering settle if tracking virtual heights
describe('Phase 6: Virtualization Engine', () => {
  afterEach(() => {
    cleanup();
  });

  const generateData = (count: number): Dataset => {
    const data = [];
    for (let i = 0; i < count; i++) {
       data.push({ id: `row-${i}`, val: Math.random() });
    }
    return data;
  };

  it('renders massive datasets without producing 10,000 DOM nodes simultaneously', () => {
    const massiveData = generateData(10000); 

    // We can't perfectly emulate DOM height in JSDOM easily without mocking element boundaries.
    // However, react-virtual will only render the overscan amount (~5-10 items) initially 
    // when parent height is 0 or statically bounded.
    // Proving it doesn't render all 10k rows is enough proof virtualization active.
    
    // We mock generic window offset properties just to prevent virtual from exploding
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 });

    const { container } = render(<SmartTable data={massiveData} />);
    
    // Check total rows rendered. It shouldn't be 10000.
    const renderedRows = container.querySelectorAll('.rst-row');
    
    // Default overscan is 5 + viewport approx rows
    // It should be significantly less than 10,000. Likely < 50.
    expect(renderedRows.length).toBeLessThan(100);
    expect(renderedRows.length).toBeGreaterThan(0);
    
    // First visible row should be rendered natively
    expect(screen.getByText('row-0')).toBeInTheDocument();
  });
});
