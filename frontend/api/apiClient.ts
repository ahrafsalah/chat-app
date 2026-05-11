
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${baseURL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const isServer = typeof window === "undefined";
    const headers : Record<string, string> = isFormData ? options.headers as Record<string, string> || {} : { "Content-Type": "application/json", ...(options.headers as Record<string, string>)  };

    if(isServer){
      const cookiesStore = await (await import ("next/headers")).cookies() 
      const token = cookiesStore.get("token")?.value
      
        headers["cookie"] = token ?`token=${token}`:""
      
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  },
  get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },
  post(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  put(endpoint: string, body: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  },
}