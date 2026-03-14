import React, { useRef } from "react";
import { Dataset, TableSchema } from "../schema/schemaTypes";
import { getCellRenderer } from "../renderers/cellRendererFactory";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getColumnWidthClass } from "./TableHeader";

import { PluginRegistry } from "../plugins/pluginRegistry";

export interface TableBodyProps {
  data: Dataset;
  schema: TableSchema;
  registry?: PluginRegistry;
}

export const TableBody: React.FC<TableBodyProps> = ({
  data,
  schema,
  registry,
}) => {
  const columns = Object.keys(schema);
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const rowVirtualizer = useVirtualizer({
    size: data.length,
    parentRef,
    estimateSize: React.useCallback(() => 45, []),
    overscan: 5,
  });

  const isVirtualized = data.length > 20;

  if (!isVirtualized) {
    return (
      <tbody className="rst-body">
        {data.map((row, index) => (
          <tr key={index} className="rst-row">
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
        ))}
      </tbody>
    );
  }

  return (
    <tbody
      className="rst-body"
      ref={parentRef}
      style={{
        height: `${rowVirtualizer.totalSize}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.virtualItems.map((virtualRow) => {
        const row = data[virtualRow.index];
        return (
          <tr
            key={virtualRow.index}
            className="rst-row"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {columns.map((colKey) => {
              const val = row[colKey];
              const colInfo = schema[colKey];
              const Renderer = getCellRenderer(colInfo.type, registry);
              const widthClass = getColumnWidthClass(colKey, colInfo.type);

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
      })}
    </tbody>
  );
};
