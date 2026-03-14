import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartTable } from '../src/components/SmartTable';
import { Dataset } from '../src/schema/schemaTypes';

describe('Phase 2: Table Core Renderer', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders "No data to display" for empty dataset', () => {
    render(<SmartTable data={[]} />);
    expect(screen.getByText('No data to display.')).toBeInTheDocument();
  });

  it('infers schema and renders columns dynamically', () => {
    const data: Dataset = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];

    render(<SmartTable data={data} />);

    // Check Headers
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent(/id/i);
    expect(headers[1]).toHaveTextContent(/name/i);

    // Check Cells
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(4); // 2 rows * 2 cols = 4 cells
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[1]).toHaveTextContent('Alice');
    expect(cells[2]).toHaveTextContent('2');
    expect(cells[3]).toHaveTextContent('Bob');
  });

  it('applies semantic renderers correctly based on inferred types', () => {
    const data: Dataset = [
      {
        email: 'test@example.com',
        website: 'https://example.com',
        avatar: 'https://example.com/icon.png',
        active: true,
        score: '99.5%',
        price: '$50.00'
      }
    ];

    render(<SmartTable data={data} />);

    // Test email
    const emailLink = screen.getByText('test@example.com');
    expect(emailLink.tagName).toBe('A');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');

    // Test url
    const urlLink = screen.getByText('https://example.com');
    expect(urlLink.tagName).toBe('A');
    expect(urlLink).toHaveAttribute('target', '_blank');

    // Test image
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/icon.png');

    // Test boolean
    expect(screen.getByText('Yes')).toBeInTheDocument();

    // Test percentage
    expect(screen.getByText('99.5%')).toBeInTheDocument();

    // Test currency (should map to number formatting currently)
    expect(screen.getByText('$50.00')).toBeInTheDocument(); // Falls back to standard literal for currency because number renderer handles NaN strings by falling back
  });
});
