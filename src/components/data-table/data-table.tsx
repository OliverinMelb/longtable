"use client"

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Table as TableType,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useRef, useCallback } from "react"
import { throttle } from "lodash"
import { Loader2 } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  totalCount?: number
  table: TableType<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onLoadMore,
  hasMore,
  loading,
  totalCount,
  table,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const parentRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()

  // 虚拟化设置
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // 行高
    overscan: 5, // 上下额外渲染的行数
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0
  const paddingBottom = virtualRows.length > 0 
    ? totalSize - virtualRows[virtualRows.length - 1].end 
    : 0

  // 滚动加载处理
  useEffect(() => {
    const scrollElement = parentRef.current
    if (!scrollElement || loading || !hasMore) return

    const handleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const scrollBottom = Math.ceil(scrollTop + clientHeight)
      const threshold = 100 // 减小触发阈值
      
      if (scrollHeight - scrollBottom <= threshold) {
        console.log('触发加载:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          distanceToBottom: scrollHeight - scrollBottom
        })
        onLoadMore()
      }
    }, 500) // 增加节流时间，避免频繁触发

    scrollElement.addEventListener('scroll', handleScroll)
    return () => {
      handleScroll.cancel()
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [loading, hasMore, onLoadMore])

  return (
    <div className="rounded-md border">
      <div 
        ref={parentRef}
        className="relative h-[600px] overflow-auto"
      >
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
              return (
                <TableRow
                  key={row.id}
                  className="h-[48px] hover:bg-muted/50 transition-colors relative"
                  data-index={virtualRow.index}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className={cell.column.id === 'select' ? 'relative' : ''}
                    >
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
            {(hasMore || loading) && (
              <tr>
                <td colSpan={columns.length}>
                  <div className="h-16 flex items-center justify-center gap-2 text-muted-foreground">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="animate-pulse">正在加载更多数据...</span>
                      </>
                    ) : (
                      <div className="opacity-70 transition-opacity hover:opacity-100">
                        向下滚动加载更多
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {!hasMore && rows.length > 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <div className="h-16 flex items-center justify-center text-muted-foreground">
                    <div className="animate-fade-in">
                      已加载全部数据 (共 {rows.length} 行)
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 