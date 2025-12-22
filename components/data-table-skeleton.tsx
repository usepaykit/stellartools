"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MixinProps, splitProps } from "@/lib/mixin";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableSkeletonProps<TData, TValue>
  extends React.ComponentProps<typeof Table>,
    MixinProps<"row", React.ComponentProps<typeof TableRow>>,
    MixinProps<"body", React.ComponentProps<typeof TableBody>>,
    MixinProps<"cell", React.ComponentProps<typeof TableCell>> {
  columns: ColumnDef<TData, TValue>[];
  enableBulkSelect?: boolean;
  actions?: unknown[];
  skeletonRowCount?: number;
}

export function DataTableSkeleton<TData, TValue>({
  columns,
  enableBulkSelect = false,
  actions,
  skeletonRowCount = 5,
  ...mixProps
}: DataTableSkeletonProps<TData, TValue>) {
  const { row, body, cell, ...rest } = splitProps(mixProps, "row", "body", "cell");

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table {...rest}>
          <TableHeader>
            <TableRow {...row}>
              {enableBulkSelect && (
                <TableHead style={{ width: 40 }}>
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead
                  key={column.id || `col-${index}`}
                  style={{
                    width:
                      (column.size as number) !== 150
                        ? (column.size as number)
                        : undefined,
                  }}
                >
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead style={{ width: 50 }}>
                  <div />
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody {...body}>
            {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`} {...row}>
                {enableBulkSelect && (
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={column.id || `skeleton-cell-${rowIndex}-${colIndex}`}
                    {...cell}
                  >
                    <Skeleton
                      className="h-4"
                      style={{
                        width: `${Math.floor(Math.random() * 40) + 60}%`,
                      }}
                    />
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell>
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {enableBulkSelect && <Skeleton className="h-4 w-32" />}
        </div>
        <div className="space-x-2">
          <Skeleton className="h-9 w-20 rounded border" />
          <Skeleton className="h-9 w-16 rounded border" />
        </div>
      </div>
    </div>
  );
}

