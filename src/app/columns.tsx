"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

export type Business = {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
}

export const columns: ColumnDef<Business>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-[40px] px-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="全选"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[40px] px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="选择行"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "名称",
  },
  {
    accessorKey: "address",
    header: "地址",
  },
  {
    accessorKey: "city",
    header: "城市",
  },
  {
    accessorKey: "state",
    header: "州/省",
  },
  // {
  //   accessorKey: "zip",
  //   header: "邮编",
  // },
  // {
  //   accessorKey: "phone",
  //   header: "电话",
  // },
  // {
  //   accessorKey: "email",
  //   header: "邮箱",
  // }
] 