import asyncio
import asyncpg

async def main():
    try:
        conn = await asyncpg.connect('postgresql://postgres:postgres@localhost/eduscan')
        await conn.execute('DROP TABLE IF EXISTS alembic_version CASCADE;')
        print('✅ Đã xóa bảng alembic_version thành công')
        await conn.close()
    except Exception as e:
        print(f'❌ Lỗi: {str(e)}')

if __name__ == "__main__":
    asyncio.run(main()) 