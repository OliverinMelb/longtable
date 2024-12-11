"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { BusinessInfo } from "./columns"
import { ChevronDown, Search, X } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onBulkUpdate: (field: keyof BusinessInfo, value: any) => void
}

export function DataTableToolbar<TData>({
  table,
  onBulkUpdate,
}: DataTableToolbarProps<TData>) {
  const isRowsSelected = table.getSelectedRowModel().rows.length > 0
  const selectedCount = table.getSelectedRowModel().rows.length

  const bulkUpdateFields: Array<{
    field: keyof BusinessInfo
    label: string
    options?: any[]
  }> = [
    { field: "state", label: "州/省", options: ["CA", "NY", "TX"] },
    { field: "city", label: "城市", options: ["Los Angeles", "New York", "Houston"] },
  ]

  return (
    <div className="flex items-center justify-between p-4 gap-4">
      <div className="flex flex-1 items-center space-x-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索商家名称..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-8"
            />
            {(table.getColumn("name")?.getFilterValue() as string) && (
              <Button
                variant="ghost"
                onClick={() => table.getColumn("name")?.setFilterValue("")}
                className="absolute right-0 top-0 h-full px-2 py-0 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
        {isRowsSelected && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              已选择 {selectedCount} 项
            </span>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8">
                  批量更新
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                {bulkUpdateFields.map(({ field, label, options }) => (
                  <DropdownMenuItem key={field as string} asChild>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="w-full text-left px-2 py-1.5 text-sm">
                        {label}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {options?.map((value) => (
                          <DropdownMenuItem
                            key={value}
                            onClick={() => onBulkUpdate(field, value)}
                            className="text-sm"
                          >
                            {value}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
} 