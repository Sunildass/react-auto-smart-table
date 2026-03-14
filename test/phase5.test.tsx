import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartTable } from '../src/components/SmartTable';
import { currencyPlugin } from '../src/plugins/currencyPlugin.tsx';
import { percentagePlugin } from '../src/plugins/percentagePlugin.tsx';
import { Dataset, SmartTablePlugin } from '../src/schema/schemaTypes';
import { buildSchema } from '../src/schema/buildSchema';
import { PluginRegistry } from '../src/plugins/pluginRegistry';

describe('Phase 5: Plugin SDK', () => {
  afterEach(() => {
    cleanup();
  });

  const mockData: Dataset = [
    { id: 1, amount_due: 100.5, completion_rate: 0.85 },
    { id: 2, amount_due: -50, completion_rate: "50%" }
  ];

  describe('Schema Detection Overrides', () => {
    it('detects columns using plugin heuristics', () => {
      const reg = new PluginRegistry();
      reg.register([currencyPlugin, percentagePlugin]);

      const schema = buildSchema(mockData, reg);

      // default inference would likely call amount_due a number and completion_rate a string or mix.
      // Plugins should aggressively tag them as currency and percentage due to column naming.
      expect(schema['amount_due'].type).toBe('currency');
      expect(schema['completion_rate'].type).toBe('percentage');
    });
  });

  describe('Cell Renderer Overrides', () => {
    it('applies custom rendering logic defined by active plugins', () => {
      render(
        <SmartTable 
          data={mockData} 
          plugins={[currencyPlugin, percentagePlugin]} 
        />
      );

      // Check Currency Plugin effect: 100.5 -> $100.50
      const positiveAmount = screen.getByText(/\$100\.50/);
      expect(positiveAmount).toBeInTheDocument();
      // Should have style color applied by plugin logic
      expect(positiveAmount).toHaveStyle('color: #388e3c');

      const negativeAmount = screen.getByText(/-\$50\.00/);
      expect(negativeAmount).toBeInTheDocument();
      expect(negativeAmount).toHaveStyle('color: #d32f2f');

      // Check Percentage Plugin effect: 0.85 -> 85.0%
      const percentageDecimal = screen.getByText('85.0%');
      expect(percentageDecimal).toBeInTheDocument();
      expect(percentageDecimal).toHaveStyle('background-color: #e3f2fd');

      const percentageString = screen.getByText('50%');
      expect(percentageString).toBeInTheDocument();
    });

    it('gracefully ignores plugins if not provided', () => {
      render(<SmartTable data={mockData} />); // No plugins prop
      
      // Default numbers renders without symbols and standard string defaults
      expect(screen.getByText('100.5')).toBeInTheDocument();
      expect(screen.getByText('-50')).toBeInTheDocument();
      expect(screen.queryByText('$100.50')).not.toBeInTheDocument();
    });
  });
});
