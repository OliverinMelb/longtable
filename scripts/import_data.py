import pandas as pd
import numpy as np
from supabase import create_client
import os
from dotenv import load_dotenv
import time
import uuid

# 加载环境变量
load_dotenv('../.env.local')

# Supabase 配置
supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
supabase = create_client(supabase_url, supabase_key)

# 读取 CSV 文件
BATCH_SIZE = 1000  # 每批处理的记录数
csv_file = '../business_info_rows (2).csv'

def transform_data(df):
    # 重命名列以匹配数据库结构
    df['business_id'] = [str(uuid.uuid4()) for _ in range(len(df))]
    df['name'] = df['retailer_name']
    df['address'] = df['location']
    
    # 选择需要的列
    columns = [
        'business_id',
        'name',
        'address',
        'city',
        'state',
    ]
    
    return df[columns]

def process_batch(df_batch):
    try:
        # 转换数据
        df_batch = transform_data(df_batch)
        
        # 处理空值
        df_batch = df_batch.replace({np.nan: None})
        
        # 转换为字典列表
        records = df_batch.to_dict('records')
        
        # 插入数据
        result = supabase.table('business_info').insert(records).execute()
        print(f"Successfully inserted {len(records)} records")
        return True
    except Exception as e:
        print(f"Error inserting batch: {e}")
        return False

def main():
    # 使用 chunks 来读取大文件
    chunk_iterator = pd.read_csv(csv_file, chunksize=BATCH_SIZE)
    total_processed = 0
    
    for chunk in chunk_iterator:
        if process_batch(chunk):
            total_processed += len(chunk)
        
        print(f"Total processed: {total_processed} records")
        time.sleep(1)  # 避免请求过快
        
    print(f"Import completed. Total records processed: {total_processed}")

if __name__ == "__main__":
    main() 