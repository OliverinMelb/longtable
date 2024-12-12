"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Business } from "@/app/columns"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onBulkUpdate: (field: keyof Business, value: string) => Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  onBulkUpdate,
}: DataTableToolbarProps<TData>) {
  const [selectedField, setSelectedField] = useState<keyof Business>()
  const [updateValue, setUpdateValue] = useState("")
  const selectedRows = table.getSelectedRowModel().rows

  const handleUpdate = async () => {
    if (!selectedField || !updateValue || selectedRows.length === 0) return
    await onBulkUpdate(selectedField, updateValue)
    setUpdateValue("")
  }

  return (
    <div className="flex items-center gap-2 py-4">
      <Select
        value={selectedField}
        onValueChange={(value) => setSelectedField(value as keyof Business)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择要更新的字段" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">名称</SelectItem>
          <SelectItem value="address">地址</SelectItem>
          <SelectItem value="city">城市</SelectItem>
          <SelectItem value="state">州/省</SelectItem>
          <SelectItem value="zip">邮编</SelectItem>
          <SelectItem value="phone">电话</SelectItem>
          <SelectItem value="email">邮箱</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="输入新值"
        value={updateValue}
        onChange={(e) => setUpdateValue(e.target.value)}
        className="w-[200px]"
      />
      <Button
        onClick={handleUpdate}
        disabled={!selectedField || !updateValue || selectedRows.length === 0}
      >
        更新选中的 {selectedRows.length} 行
      </Button>
    </div>
  )
} 