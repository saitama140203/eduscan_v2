export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
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
  console.log(`API Request to ${endpoint}:`, {
    method: fetchOptions.method || 'GET',
    headers: fetchOptions.headers,
    bodyType: fetchOptions.body ? typeof fetchOptions.body : null
  })

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions)

  // Log response để debug
  console.log(`API Response from ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    contentType: response.headers.get("Content-Type")
  })

  // Clone response để đọc body mà không ảnh hưởng đến lần đọc tiếp theo (json/text)
  const responseClone = response.clone();
  responseClone.text().then(text => {
      console.log(`API Response Body (preview) from ${endpoint}:`, text.substring(0, 200));
  }).catch(e => console.error(`Failed to read response body preview from ${endpoint}:`, e));

  if (response.status === 401 && !skipAuth) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login"
    }
    throw new Error("Unauthorized")
  }

  if (!response.ok) {
    let message = "API error"
    try {
      const err = await response.json()
      message = err.detail || JSON.stringify(err)
    } catch {}
    throw new Error(message)
  }

  const contentType = response.headers.get("Content-Type")
  if (contentType && contentType.includes("application/json")) {
    console.log(`API Response from ${endpoint}: Parsing as JSON`);
    return response.json()
  }
  console.log(`API Response from ${endpoint}: Parsing as Text`);
  return response.text()
}
