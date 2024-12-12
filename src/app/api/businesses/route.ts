import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = parseInt(searchParams.get('cursor') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 先获取总数
    const { count, error: countError } = await supabase
      .from('business_info')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      throw countError;
    }

    console.log('Total count from DB:', count); // 添加日志

    // 获取分页数据
    const { data, error: dataError } = await supabase
      .from('business_info')
      .select('*')
      .range(cursor, cursor + limit - 1)
      .order('id', { ascending: true });

    if (dataError) {
      console.error('Data error:', dataError);
      throw dataError;
    }

    const actualCount = count || 0;
    const hasMore = cursor + limit < actualCount;

    console.log('Response stats:', {
      cursor,
      limit,
      dataLength: data?.length,
      totalCount: actualCount,
      hasMore
    });

    return NextResponse.json({
      items: data || [],
      nextCursor: cursor + (data?.length || 0),
      hasMore,
      totalCount: actualCount
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
} 