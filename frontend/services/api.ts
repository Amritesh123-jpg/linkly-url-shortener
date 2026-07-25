 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  shortCode: string
  clicks: number  
  createdAt: string
  expiresAt: string | null
  title?: string
  favicon?: string
}

interface AnalyticsData {
  totalClicks: number;
  totalUrls: number;
  averageClicks: number;
  activeUrls: number;
  expiredUrls: number;

  clicksOverTime: {
    date: string;
    clicks: number;
  }[];

  topUrls: {
    id: string;
    shortCode: string;
    originalUrl: string;
    clicks: number;
  }[];
}
 
 interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;

  mostClickedUrl: ShortenedUrl | null;
}

interface PaginatedUrls {
  urls: ShortenedUrl[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}





class ApiService {
  private token: string | null = null

  setToken(token: string | null) {
  this.token = token;
}

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log("Request URL:", `${API_BASE_URL}${endpoint}`);
   const token =
    this.token ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("token")
      : null);
  console.log("Authorization Token:", token);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("Status:", response.status);
    console.log("URL:", `${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Something went wrong")
    }
    console.log("Authorization Token🔜:", token);
    return response.json()
  }

  // URL Shortening
  async shortenUrl(
  originalUrl: string,
  customAlias?: string,
  tag?: string,
  expiry?: string
): Promise<ShortenedUrl> {

  const response = await this.request<any>("/url/shorten", {
    method: "POST",
    body: JSON.stringify({
      originalUrl,
      customAlias,
      tag,
      expiry,
    }),
  });

  console.log(response);
  
  return {
    id: response.data.url._id,
    originalUrl: response.data.url.originalUrl,
    shortUrl: response.data.shortUrl,
    shortCode: response.data.url.shortCode,
    clicks: response.data.url.clicks,
    createdAt: response.data.url.createdAt,
    expiresAt: response.data.url.expiresAt,
    title: response.data.url.title,
    favicon: response.data.url.favicon,
  };
}

  async getUrls(
    page = 1,
    limit = 10,
    search="",
    sort="-createdAt",
    status = "all",
    tags: string[] = []
   ): Promise<PaginatedUrls> {
          
        const tagQuery =
          tags.length > 0
            ? `&tag=${encodeURIComponent(tags.join(","))}`
            : "";

   const response = await this.request<any>(
  `/url/getMyUrls?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sort=${sort}&status=${status}${tagQuery}`
);
        console.log("Response",response);
      return {
     urls: response.data.urls.map((url: any) => ({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `http://localhost:8000/${url.shortCode}`,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
       title: url.title,
       favicon: url.favicon,
    })),
    currentPage: response.currentPage,
    totalPages: response.totalPages,
    totalResults: response.totalResults,
     };
  }
        

  async getDashboardStats(): Promise<DashboardStats> {
  const response = await this.request<any>("/url/dashboard");

  return {
    totalUrls: response.data.totalUrls,
    totalClicks: response.data.totalClicks,
    activeUrls: response.data.activeUrls,
    expiredUrls: response.data.expiredUrls,
    mostClickedUrl: response.data.mostClickedUrl,
  };
}

    

  async deleteUrl(id: string): Promise<void> {
  await this.request(`/url/${id}`, {
    method: "DELETE",
  });
}

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await this.request<any>("/url/dashboard-analytics");

    return {
      totalClicks: response.data.totalClicks,
      totalUrls: response.data.totalUrls,
      averageClicks: response.data.averageClicks,
      activeUrls: response.data.activeUrls,
      expiredUrls: response.data.expiredUrls,

      // Backend me abhi clicksOverTime nahi hai
      clicksOverTime: response.data.clicksOverTime,

      topUrls: response.data.topUrls,
    };
  }

  async login(email: string, password: string) {
    return this.request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    })

  }

async restoreUrl(id: string, duration: number): Promise<void> {
  await this.request(`/url/restore/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      duration,
    }),
  });
}

getQrCode(id: string) {

  console.log("Token:", this.token);
  console.log("URL:", `${API_BASE_URL}/url/qr/${id}`);

  return fetch(`${API_BASE_URL}/url/qr/${id}`, {
    headers: {
      Authorization: `Bearer ${this.token}`,
    },
  });
};

async signup(data: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) {
  console.log("Calling backend signup");
  return this.request<any>("/auth/sign", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async getProfile() {
  const response = await this.request<any>("/users/me");

  return {
    id: response.data.user._id,
    name: response.data.user.name,
    email: response.data.user.email,
    role: response.data.user.role,
    createdAt: response.data.user.createdAt,
  };
}

   async updateProfile(name: string) {
      const response = await this.request<any>("/users/updateMe", {
        method: "PATCH",
        body: JSON.stringify({
          name,
        }),
      });
      return {
        id: response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        createdAt: response.data.user.createdAt,
      };
    }

    async updatePassword(
          currentPassword: string,
          newPassword: string,
          passwordConfirm: string
        ) {
          return this.request<any>("/users/updatePassword", {
            method: "PATCH",
            body: JSON.stringify({
              currentPassword,
              newPassword,
              passwordConfirm,
            }),
          });
        }

   async getTags() {
  return this.request<{ tags: string[] }>("/url/tags");
   }
/*-----------------------------------------------*/
}





export const apiService = new ApiService()
export type { ShortenedUrl, AnalyticsData,DashboardStats }
