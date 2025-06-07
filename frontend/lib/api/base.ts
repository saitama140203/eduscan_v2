import { debugLog, debugError } from "../utils/debug"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  data: any;
  isNetworkError: boolean;

  constructor(message: string, status: number = 0, statusText: string = "", data: any = null, isNetworkError: boolean = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }
}

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {},
  { skipAuth = false }: { skipAuth?: boolean } = {}
) {
  const headers = { ...(options.headers || {}) }
  
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
  }

  // Xử lý body là object (JSON) - chỉ khi chưa có Content-Type
  const hasContentType = headers && 
    Object.keys(headers).some(h => h.toLowerCase() === "content-type")
  
  if (
    fetchOptions.body &&
    typeof fetchOptions.body === "object" &&
    !(fetchOptions.body instanceof FormData) &&
    !(fetchOptions.body instanceof URLSearchParams) &&
    !hasContentType
  ) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      "Content-Type": "application/json",
    }
    fetchOptions.body = JSON.stringify(fetchOptions.body)
  }

  // Log request để debug
  debugLog(`API Request to ${endpoint}:`, {
    method: fetchOptions.method || 'GET',
    headers: fetchOptions.headers,
    bodyType: fetchOptions.body ? typeof fetchOptions.body : null
  })

  let response: Response;
  
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
  } catch (error) {
    debugError(`Network error when fetching ${endpoint}:`, error);
    
    // Kiểm tra nếu đang chạy trên localhost và có thể là lỗi CORS
    const isCorsIssue = 
      (typeof window !== 'undefined' && 
       window.location.hostname === 'localhost' && 
       API_BASE_URL.includes('localhost'));
    
    if (isCorsIssue) {
      throw new ApiError(
        "Lỗi CORS: Không thể kết nối đến API. Vui lòng kiểm tra cấu hình CORS ở backend và đảm bảo rằng API đang chạy.",
        0,
        "CORS Error",
        null,
        true
      );
    }
    
    throw new ApiError(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn hoặc thử lại sau.",
      0,
      "Network Error",
      null,
      true
    );
  }

  // Log response để debug
  debugLog(`API Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    contentType: response.headers.get("Content-Type")
  })

  // Clone response để đọc body mà không ảnh hưởng đến lần đọc tiếp theo (json/text)
  if (process.env.NODE_ENV === 'development') {
    const responseClone = response.clone();
    responseClone.text()
      .then(text => {
        debugLog(
          `API Response Body (preview) from ${endpoint}:`,
          text.substring(0, 200)
        );
      })
      .catch(e => debugError(`Failed to read response body preview from ${endpoint}:`, e));
  }

  if (response.status === 401 && !skipAuth) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
    throw new ApiError(
      "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
      401,
      response.statusText,
      null
    );
  }

  if (!response.ok) {
    let errorData = null;
    let errorMessage = "Đã xảy ra lỗi khi liên hệ với máy chủ";
    
    try {
      errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // Nếu không thể parse JSON, thử lấy text
      try {
        errorMessage = await response.text() || errorMessage;
      } catch (textError) {
        debugError("Failed to parse error response:", textError);
      }
    }
    
    // Tạo thông báo lỗi cụ thể dựa trên mã HTTP
    if (response.status >= 500) {
      errorMessage = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
    } else if (response.status === 400) {
      errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
    } else if (response.status === 403) {
      errorMessage = "Bạn không có quyền thực hiện hành động này.";
    } else if (response.status === 404) {
      errorMessage = "Không tìm thấy tài nguyên yêu cầu.";
    } else if (response.status === 429) {
      errorMessage = "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
    }
    
    throw new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      errorData
    );
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    debugLog(`API Response from ${endpoint}: Parsing as JSON`);
    return response.json();
  }
  
  debugLog(`API Response from ${endpoint}: Parsing as Text`);
  return response.text();
}
