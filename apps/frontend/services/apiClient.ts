const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://13.63.239.214:5000";

// Helper to get cookie token
const getTokenFromCookies = () => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getTokenFromCookies();

  const res = await fetch(`${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // important for cookies
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};