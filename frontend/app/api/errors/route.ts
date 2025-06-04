import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const errorData = await request.json();
    
    // Chỉ log ra console trong development
    if (process.env.NODE_ENV === 'development') {
      console.log('Error reported to API:', errorData);
    }
    
    // Trong môi trường thực tế, bạn có thể lưu vào DB hoặc gửi tới hệ thống giám sát
    // Tạm thời ở đây chỉ trả về success

    return NextResponse.json({ success: true, serverTimestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error handling error report:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
