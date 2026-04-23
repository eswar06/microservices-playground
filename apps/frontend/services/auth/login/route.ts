import { apiFetch } from "../../apiClient";

export const login = async (email: string, password: string) => {
  const url = process.env.AUTH_SERVICE_URL
  const data = await apiFetch(url + "/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // store token in cookie
  if (data.token) {
    document.cookie = `token=${data.token}; path=/`;
  }

  return data;
};

