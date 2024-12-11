"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  totalCount?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onLoadMore,
  hasMore,
  loading,
  totalCount,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const { rows } = table.getRowModel()
  const parentRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLTableRowElement>(null)
  const observerRef = useRef<IntersectionObserver>()

  const virtualizer = useVirtualizer({
    count: rows.length + (hasMore ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 45,
    overscan: 5,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length > 0 
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end 
    : 0

  useEffect(() => {
    console.log('Data length:', data.length);
    console.log('Rows length:', rows.length);
    console.log('Virtual rows:', virtualRows);
  }, [data, rows, virtualRows]);

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current

    if (!currentLoadMoreRef || !hasMore || loading) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log('Loading more data...');
          onLoadMore()
        }
      },
      { 
        root: null,
        threshold: 0.1,
        rootMargin: '200px'
      }
    )

    observerRef.current.observe(currentLoadMoreRef)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, onLoadMore])

  // 移除不正确的调试日志
  useEffect(() => {
    console.log('Current total count:', totalCount);
    console.log('Current loaded:', rows.length);
    console.log('Has more:', hasMore);
    console.log('Loading:', loading);
  }, [totalCount, hasMore, loading, rows.length]);

  return (
    <div className="rounded-md border">
      <div 
        ref={parentRef} 
        className="relative h-[600px] overflow-auto will-change-scroll"
        style={{ scrollBehavior: 'smooth' }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) {
                return hasMore ? (
                  <TableRow 
                    ref={loading ? undefined : loadMoreRef}
                    key="loader"
                    className="h-[45px]"
                  >
                    <TableCell 
                      colSpan={columns.length} 
                      className="text-center text-muted-foreground"
                    >
                      {loading ? "加载中..." : "加载更多..."}
                    </TableCell>
                  </TableRow>
                ) : null
              }

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-[45px]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
              </tr>
            )}
            {!hasMore && rows.length > 0 && (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center h-[45px] text-muted-foreground"
                >
                  已加载完毕 (共 {rows.length} 行)
                </TableCell>
              </TableRow>
            )}
            {hasMore && rows.length > 0 && (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center h-[45px] text-muted-foreground"
                >
                  已加载 {rows.length} 行 {totalCount ? `(总共 ${totalCount} 行)` : ''}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 