import React, { useRef, useMemo, useCallback } from "react";
import { Dataset, TableSchema } from "../schema/schemaTypes";
import { getCellRenderer } from "../renderers/cellRendererFactory";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getColumnWidthClass } from "./TableHeader";
import { PluginRegistry } from "../plugins/pluginRegistry";

/**
 * Props for the TableBody component
 */
export interface TableBodyProps {
  data: Dataset;
  schema: TableSchema;
  registry?: PluginRegistry;
  /**
   * Ref to the scrollable container. 
   * Required for correct virtualization positioning.
   */
  scrollRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Helper component for rendering a single table row.
 * Shared between virtualized and non-virtualized rendering.
 */
const TableRow: React.FC<{
  row: any;
  index: number;
  columns: string[];
  schema: TableSchema;
  registry?: PluginRegistry;
  style?: React.CSSProperties;
}> = ({ row, index, columns, schema, registry, style }) => {
  return (
    <tr className="rst-row" style={style}>
      {columns.map((colKey) => {
        const colInfo = schema[colKey];
        const Renderer = getCellRenderer(colInfo.type, registry);
        const widthClass = getColumnWidthClass(colKey, colInfo.type);
        const val = row[colKey];

        return (
          <td
            key={colKey}
            className={`rst-td rst-td-col-${colKey} rst-td-type-${colInfo.type} ${widthClass}`}
          >
            {colInfo.type === "boolean" ? (
              <span
                className={`rst-badge ${val ? "rst-badge-yes" : "rst-badge-no"}`}
              >
                {val ? "Yes" : "No"}
              </span>
            ) : (
              <Renderer value={val} />
            )}
          </td>
        );
      })}
    </tr>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({
  data,
  schema,
  registry,
  scrollRef,
}) => {
  const columns = useMemo(() => Object.keys(schema), [schema]);
  
  // Virtualization threshold (can be made configurable if needed)
  const isVirtualized = data.length > 20;

  // Row virtualizer setup using TanStack Virtual v3 API
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef?.current || null,
    estimateSize: useCallback(() => 45, []),
    overscan: 5,
    enabled: isVirtualized,
    // Provide an initialRect to ensure virtualization works in JSDOM 
    // and during the very first render before ResizeObserver kicks in.
    initialRect: { width: 0, height: 600 },
  });

  // Small dataset: Standard non-virtual rendering
  if (!isVirtualized || !scrollRef) {
    return (
      <tbody className="rst-body">
        {data.map((row, index) => (
          <TableRow
            key={index}
            row={row}
            index={index}
            columns={columns}
            schema={schema}
            registry={registry}
          />
        ))}
      </tbody>
    );
  }

  // Large dataset: Virtualized rendering
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <tbody
      className="rst-body rst-body-virtualized"
      style={{
        height: `${totalSize}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {virtualRows.length > 0 ? (
        virtualRows.map((virtualRow) => (
          <TableRow
            key={virtualRow.key}
            row={data[virtualRow.index]}
            index={virtualRow.index}
            columns={columns}
            schema={schema}
            registry={registry}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))
      ) : (
        // Fallback for edge cases where virtualizer might be settling
        <tr style={{ height: `${totalSize}px` }}>
          <td colSpan={columns.length} />
        </tr>
      )}
    </tbody>
  );
};
