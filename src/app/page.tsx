"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { columns, BusinessInfo } from "@/components/data-table/columns"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"
import { supabase } from "@/lib/supabase"

const PAGE_SIZE = 50
const DEBOUNCE_DELAY = 300 // 300ms 的防抖延迟

export default function Home() {
  const [data, setData] = useState<BusinessInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const currentLength = useRef(0)
  const loadingRef = useRef(false)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const loadDataBase = useCallback(async () => {
    try {
      if (loadingRef.current || !hasMore) {
        console.log('Loading blocked:', { loading: loadingRef.current, hasMore });
        return;
      }
      
      loadingRef.current = true;
      setLoading(true)
      
      // 首次加载时获取总数
      if (currentLength.current === 0) {
        const { count } = await supabase
          .from('business_info')
          .select('count', { count: 'exact' });
        setTotalCount(count || 0);
        console.log('Total records:', count);
      }

      console.log('Loading from:', currentLength.current, 'to:', currentLength.current + PAGE_SIZE - 1);

      const { data: businessData, error } = await supabase
        .from('business_info')
        .select('*')
        .range(currentLength.current, currentLength.current + PAGE_SIZE - 1)
        .order('id', { ascending: true })

      if (error) throw error

      if (businessData && businessData.length > 0) {
        setData(prev => [...prev, ...businessData])
        currentLength.current += businessData.length
        
        // 检查是否还有更多数据
        const hasMoreData = currentLength.current < totalCount;
        console.log('Has more data:', hasMoreData, 'Current:', currentLength.current, 'Total:', totalCount);
        setHasMore(hasMoreData)
      } else {
        console.log('No more data received');
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setHasMore(false)
    } finally {
      loadingRef.current = false;
      setLoading(false)
    }
  }, [hasMore, totalCount])

  // 添加新的初始加载逻辑
  useEffect(() => {
    const initLoad = async () => {
      await loadDataBase();
    };
    initLoad();
  }, []);

  const handleBulkUpdate = async (field: keyof BusinessInfo, value: any) => {
    try {
      const selectedRows = table.getSelectedRowModel().rows
      const selectedIds = selectedRows.map(row => row.original.id)
      
      const { error } = await supabase
        .from('business_info')
        .update({ [field]: value })
        .in('id', selectedIds)

      if (error) throw error
      
      // 更新本地数据
      setData(prevData => 
        prevData.map(item => 
          selectedIds.includes(item.id) 
            ? { ...item, [field]: value }
            : item
        )
      )
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <DataTableToolbar table={table} onBulkUpdate={handleBulkUpdate} />
      <DataTable 
        columns={columns} 
        data={data} 
        onLoadMore={loadDataBase}
        hasMore={hasMore}
        loading={loading}
        totalCount={totalCount}
      />
    </div>
  )
} 