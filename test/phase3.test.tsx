import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SmartTable } from '../src/components/SmartTable';
import { Dataset } from '../src/schema/schemaTypes';

describe('Phase 3: Filters and Sorting Integration', () => {
  afterEach(() => {
    cleanup();
  });

  const mockData: Dataset = [
    { id: 1, name: 'Alice', age: 30, active: true, joined: '2023-01-01' },
    { id: 2, name: 'Bob', age: 25, active: false, joined: '2023-05-15' },
    { id: 3, name: 'Charlie', age: 35, active: true, joined: '2023-03-10' }
  ];

  it('renders sort controllers when sortable is true', () => {
    render(<SmartTable data={mockData} sortable />);
    // Schema inference makes id, name, age, active, joined into columns.
    // Each header should have a sort arrow wrapper rendering text content like '▲▼'
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(5);
    
    // Check if the sort controller is present (it renders the arrows)
    const arrowSpans = screen.getAllByText(/↑|↓|⇅/);
    expect(arrowSpans.length).toBeGreaterThan(0);
  });

  it('sorts columns when clicking header', () => {
    render(<SmartTable data={mockData} sortable />);
    
    const nameHeader = screen.getAllByRole('columnheader').find(h => h.textContent?.toLowerCase().includes('name'));
    expect(nameHeader).toBeDefined();

    // Initial render is unsorted, but defaults to insertion order
    let firstRowCell = screen.getAllByRole('cell')[1]; // name col of first row
    expect(firstRowCell).toHaveTextContent('Alice');

    // Click to sort by Name (Ascending)
    fireEvent.click(nameHeader!);
    
    // Row order should be Alice, Bob, Charlie... same order
    firstRowCell = screen.getAllByRole('cell')[1];
    expect(firstRowCell).toHaveTextContent('Alice');

    // Click again to sort Descending
    fireEvent.click(nameHeader!);

    // Now Charlie should be first
    firstRowCell = screen.getAllByRole('cell')[1];
    expect(firstRowCell).toHaveTextContent('Charlie');
  });

  it('renders filter panel when filterable is true', () => {
    render(<SmartTable data={mockData} filterable />);
    expect(screen.getByPlaceholderText(/search name/i)).toBeInTheDocument();
    
    // Numeric filters
    const maxInputs = screen.getAllByPlaceholderText('Max');
    expect(maxInputs.length).toBeGreaterThan(0); // For ID and Age
  });

  it('filters data based on string input', () => {
    render(<SmartTable data={mockData} filterable />);
    
    expect(screen.getAllByRole('row')).toHaveLength(4); // 3 data rows + 1 header row
    
    const searchName = screen.getByPlaceholderText(/search name/i);
    fireEvent.change(searchName, { target: { value: 'Ali' } });

    // Should only show Alice
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 header + 1 Alice
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('filters data based on boolean toggle', () => {
    render(<SmartTable data={mockData} filterable />);
    
    // active column should render a boolean toggle button
    const toggleBtn = screen.getByText('All'); // Initial state
    
    // Click: true
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Only Yes')).toBeInTheDocument();
    // Alice and Charlie are active true
    expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 rows

    // Click: false
    fireEvent.click(screen.getByText('Only Yes'));
    expect(screen.getByText('Only No')).toBeInTheDocument();
    // Only Bob is active false
    expect(screen.getAllByRole('row')).toHaveLength(2); // Header + 1 row
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('paginates data when pagination mode is active', () => {
    // Just mock 12 rows to force pagination (default pageSize=10)
    const largeData = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, data: 'test' }));
    render(<SmartTable data={largeData} pagination />);
    
    // 10 data rows + 1 header = 11
    expect(screen.getAllByRole('row')).toHaveLength(11);
    
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    // 2 data rows + 1 header
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });
});
