"use client"

import { useEffect, useState, useCallback } from 'react'
import { DataTable } from '@/components/data-table/data-table'
import { columns } from './columns'
import { fetchBusinessData } from '@/lib/data'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Business } from "@/app/columns"
import { createClient } from '@supabase/supabase-js'
import { useReactTable, getCoreRowModel } from "@tanstack/react-table"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Page() {
  const [data, setData] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  // 初始化 table
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const result = await fetchBusinessData({ cursor, limit: 50 });
      
      setData(prevData => [...prevData, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor]);

  // 只加载第一页数据
  useEffect(() => {
    if (!initialLoadDone) {
      loadMoreData();
      setInitialLoadDone(true);
    }
  }, [loadMoreData, initialLoadDone]);

  const handleBulkUpdate = async (field: keyof Business, value: string) => {
    try {
      const selectedRows = table.getSelectedRowModel().rows
      const selectedIds = selectedRows.map(row => row.original.id)
      
      console.log('开始更新:', {
        field,
        value,
        selectedIds,
        table: 'business_info'
      });

      // 先验证数据是否存在
      const { data: existingData, error: checkError } = await supabase
        .from('business_info')
        .select('id')
        .in('id', selectedIds);

      if (checkError) {
        console.error('验证数据失败:', checkError);
        throw checkError;
      }

      console.log('找到的现有数据:', existingData);

      // 执行更新
      const { data: updatedData, error: updateError } = await supabase
        .from('business_info')
        .update({ [field]: value })
        .in('id', selectedIds)
        .select();

      if (updateError) {
        console.error('更新失败:', updateError);
        throw updateError;
      }

      if (!updatedData || updatedData.length === 0) {
        throw new Error('更新成功但未返回数据');
      }

      console.log('更新成功，返回的数据:', updatedData);

      // 更新本地数据
      setData(prevData => 
        prevData.map(item => {
          const updated = updatedData.find(u => u.id === item.id);
          return updated || item;
        })
      );

      // 清除选择
      table.toggleAllRowsSelected(false);

    } catch (error) {
      console.error('批量更新失败:', error);
      if (error instanceof Error) {
        alert(`更新失败: ${error.message}`);
      } else {
        alert('更新失败: 未知错误');
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <DataTableToolbar table={table} onBulkUpdate={handleBulkUpdate} />
      <div className="mb-4 text-sm text-muted-foreground">
        已加载: {data.length} 行 {totalCount ? `/ 总共 ${totalCount} 行` : ''} 
        {loading && ' (加载中...)'}
      </div>
      <DataTable
        columns={columns}
        data={data}
        onLoadMore={loadMoreData}
        hasMore={hasMore}
        loading={loading}
        totalCount={totalCount}
        table={table}
      />
    </div>
  );
} 